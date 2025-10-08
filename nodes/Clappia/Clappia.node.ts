import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	ILoadOptionsFunctions,
	INodeListSearchResult,
	NodeOperationError,
} from 'n8n-workflow';
import { submissionOperations, submissionFields } from './SubmissionDescription';

export class Clappia implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Clappia',
		name: 'clappia',
		icon: 'file:clappia.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Create, edit, retrieve and manage submissions in Clappia no-code apps. Use "Get App Definition" first to discover available fields for any app.',
		defaults: {
			name: 'Clappia',
		},
		inputs: ['main'],
		outputs: ['main'],
		usableAsTool: true,
		codex: {
			categories: ['Business Apps'],
			subcategories: {
				'Business Apps': ['No-Code Platforms', 'Data Management'],
			},
			resources: {
				primaryDocumentation: [
					{
						url: 'https://www.clappia.com/help',
					},
				],
			},
		},
		credentials: [
			{
				name: 'clappiaApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Submission',
						value: 'submission',
					},
				],
				default: 'submission',
			},
			...submissionOperations,
			...submissionFields,
		],
	};

	methods = {
		loadOptions: {
			// Get field names from app definition
			async getAppFields(this: ILoadOptionsFunctions) {
				const appIdData = this.getNodeParameter('appId', 0) as any;
				const appId = appIdData?.value || appIdData;
				
				if (!appId) {
					return [];
				}

				const credentials = await this.getCredentials('clappiaApi');
				const workplaceId = credentials.workplaceId as string;

				try {
					const response = await this.helpers.httpRequest({
						method: 'GET',
						url: `https://api-public-v3.clappia.com/appdefinitionv2/getAppDefinition?appId=${appId}&workplaceId=${workplaceId}`,
						headers: {
							'x-api-key': credentials.apiKey as string,
							'workplaceId': workplaceId,
							'Content-Type': 'application/json',
						},
						json: true,
					});

					const fieldDefinitions = response.fieldDefinitions || {};
					
					return Object.keys(fieldDefinitions).map((fieldName) => {
						const field = fieldDefinitions[fieldName];
						const label = field.label || fieldName;
						
						return {
							name: `${label} (${fieldName})`,
							value: fieldName,
						};
					});
				} catch (error) {
					return [];
				}
			},
		},
		listSearch: {
			// Method to fetch apps dynamically
			async getApps(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
				const credentials = await this.getCredentials('clappiaApi');
				const workplaceId = credentials.workplaceId as string;

				try {
					const response = await this.helpers.httpRequest({
						method: 'GET',
						url: `https://api-public-v3.clappia.com/workplace/getApps?workplaceId=${workplaceId}`,
						headers: {
							'x-api-key': credentials.apiKey as string,
							'workplaceId': workplaceId,
							'Content-Type': 'application/json',
						},
						json: true,
					});

				// Response is directly an array of apps
				const apps = Array.isArray(response) ? response : [];

				if (apps.length === 0) {
					return {
						results: [],
					};
				}

				const results = apps
					.filter((app: any) => app && app.appId) // Filter out invalid entries
					.map((app: any) => {
						// Use appId as both value and fallback name (some apps have empty names)
						const appName = app.name && app.name.trim() !== '' ? app.name : app.appId;
						
						return {
							name: String(appName),
							value: String(app.appId),
							url: 'https://www.clappia.com/help',
						};
					});

					return {
						results,
					};
				} catch (error) {
					throw new NodeOperationError(
						this.getNode(),
						`Failed to fetch apps: ${error.message}`,
					);
				}
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const credentials = await this.getCredentials('clappiaApi');
		const workplaceId = credentials.workplaceId as string;
		const requestingUserEmailAddress = credentials.requestingUserEmailAddress as string;
		const BASE_URL = 'https://api-public-v3.clappia.com';

		// Ensure at least one execution even if there's no input data
		const length = items.length === 0 ? 1 : items.length;
		const hasInputData = items.length > 0;
		
		for (let i = 0; i < length; i++) {
			// Use index 0 for parameters when there's no input data
			const itemIndex = hasInputData ? i : 0;
			try {
				if (resource === 'submission') {
					// Get the app ID from resourceLocator
					const appIdData = this.getNodeParameter('appId', itemIndex) as any;
					const appId = appIdData.value || appIdData;

					if (operation === 'create') {
						// Create a new submission
						const dataMode = this.getNodeParameter('dataMode', itemIndex, 'form') as string;
						let submissionData: any = {};

						if (dataMode === 'form') {
							// Form mode: build object from individual fields
							const fields = this.getNodeParameter('fields.field', itemIndex, []) as Array<{name: string, value: string}>;
							for (const field of fields) {
								if (field.name && field.value !== undefined) {
									submissionData[field.name] = field.value;
								}
							}
						} else {
							// JSON mode: parse JSON string
							const submissionDataString = this.getNodeParameter('submissionData', itemIndex) as string;
							submissionData = JSON.parse(submissionDataString);
						}

						const response = await this.helpers.httpRequest({
							method: 'POST',
							url: `${BASE_URL}/submissions/create`,
							headers: {
								'x-api-key': credentials.apiKey as string,
								'Content-Type': 'application/json',
							},
							body: {
								appId,
								workplaceId,
								requestingUserEmailAddress,
								data: submissionData,
							},
							json: true,
						});

						const executionData: INodeExecutionData = { json: response };
						if (hasInputData) {
							executionData.pairedItem = { item: i };
						}
						returnData.push(executionData);
					} else if (operation === 'getMany') {
						// Get multiple submissions with optional filtering
						const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
						const limit = this.getNodeParameter('limit', itemIndex, 10) as number;
						const options = this.getNodeParameter('options', itemIndex, {}) as any;

						// Build filters according to Clappia API structure
						const body: any = {
							workplaceId,
							appId,
							requestingUserEmailAddress,
							forward: true,
							pageSize: returnAll ? 1000 : limit,
						};

						// Add filters if provided
						if (options.filterByCustomField?.customFilters && options.filterByCustomField.customFilters.length > 0) {
							const conditions = options.filterByCustomField.customFilters.map((filter: any) => ({
								operator: 'CONTAINS',
								filterKeyType: 'CUSTOM',
								key: filter.fieldId,
								value: filter.fieldValue,
							}));

							body.filters = {
								queries: [
									{
										queries: [],
										conditions,
										operator: 'AND',
									},
								],
								conditions: [],
								operator: 'AND',
							};
						}

						const response = await this.helpers.httpRequest({
							method: 'POST',
							url: `${BASE_URL}/submissions/getSubmissions`,
							headers: {
								'x-api-key': credentials.apiKey as string,
								'Content-Type': 'application/json',
							},
							body,
							json: true,
						});

						// Handle response - assuming it returns an array of submissions
						let submissions = Array.isArray(response) ? response : response.data || response.submissions || [];

						submissions.forEach((submission: any) => {
							const executionData: INodeExecutionData = { json: submission };
							if (hasInputData) {
								executionData.pairedItem = { item: i };
							}
							returnData.push(executionData);
						});
					} else if (operation === 'edit') {
						// Edit an existing submission
						const submissionId = this.getNodeParameter('submissionId', itemIndex) as string;
						const dataMode = this.getNodeParameter('dataMode', itemIndex, 'form') as string;
						let editData: any = {};

						if (dataMode === 'form') {
							// Form mode: build object from individual fields
							const fields = this.getNodeParameter('fields.field', itemIndex, []) as Array<{name: string, value: string}>;
							for (const field of fields) {
								if (field.name && field.value !== undefined) {
									editData[field.name] = field.value;
								}
							}
						} else {
							// JSON mode: parse JSON string
							const editDataString = this.getNodeParameter('editData', itemIndex) as string;
							editData = JSON.parse(editDataString);
						}

						const response = await this.helpers.httpRequest({
							method: 'POST',
							url: `${BASE_URL}/submissions/edit`,
							headers: {
								'x-api-key': credentials.apiKey as string,
								'Content-Type': 'application/json',
							},
							body: {
								appId,
								workplaceId,
								submissionId,
								requestingUserEmailAddress,
								data: editData,
							},
							json: true,
						});

						const executionData: INodeExecutionData = { json: response };
						if (hasInputData) {
							executionData.pairedItem = { item: i };
						}
						returnData.push(executionData);
					} else if (operation === 'get') {
						// Get a single submission
						const submissionId = this.getNodeParameter('submissionId', itemIndex) as string;

						const response = await this.helpers.httpRequest({
							method: 'GET',
							url: `${BASE_URL}/submissions/getSubmission?workplaceId=${workplaceId}&appId=${appId}&submissionId=${submissionId}`,
							headers: {
								'x-api-key': credentials.apiKey as string,
							},
							json: true,
						});

						const executionData: INodeExecutionData = { json: response };
						if (hasInputData) {
							executionData.pairedItem = { item: i };
						}
						returnData.push(executionData);
					} else if (operation === 'getAppDefinition') {
						// Get app field definitions
						const response = await this.helpers.httpRequest({
							method: 'GET',
							url: `${BASE_URL}/appdefinitionv2/getAppDefinition?appId=${appId}&workplaceId=${workplaceId}`,
							headers: {
								'x-api-key': credentials.apiKey as string,
								'workplaceId': workplaceId,
								'Content-Type': 'application/json',
							},
							json: true,
						});

						const executionData: INodeExecutionData = { json: response };
						if (hasInputData) {
							executionData.pairedItem = { item: i };
						}
						returnData.push(executionData);
				} else if (operation === 'getOwner') {
						// Update submission owners (Note: Clappia API only has updateSubmissionOwners, not get owner)
						const submissionId = this.getNodeParameter('submissionId', itemIndex) as string;
						const emailIdsString = this.getNodeParameter('emailIds', itemIndex, '') as string;
						const emailIds = emailIdsString ? emailIdsString.split(',').map(email => email.trim()) : [];

						const response = await this.helpers.httpRequest({
							method: 'POST',
							url: `${BASE_URL}/submissions/updateSubmissionOwners`,
							headers: {
								'x-api-key': credentials.apiKey as string,
								'Content-Type': 'application/json',
							},
							body: {
								appId,
								workplaceId,
								submissionId,
								requestingUserEmailAddress,
								emailIds,
							},
							json: true,
						});

						const executionData: INodeExecutionData = { json: response };
						if (hasInputData) {
							executionData.pairedItem = { item: i };
						}
						returnData.push(executionData);
					} else if (operation === 'updateStatus') {
						// Update submission status
						const submissionId = this.getNodeParameter('submissionId', itemIndex) as string;
						const statusName = this.getNodeParameter('status', itemIndex) as string;
						const statusComments = this.getNodeParameter('statusComments', itemIndex, '') as string;

						const response = await this.helpers.httpRequest({
							method: 'POST',
							url: `${BASE_URL}/submissions/updateStatus`,
							headers: {
								'x-api-key': credentials.apiKey as string,
								'Content-Type': 'application/json',
							},
							body: {
								appId,
								workplaceId,
								submissionId,
								requestingUserEmailAddress,
								status: {
									name: statusName,
									...(statusComments && { comments: statusComments }),
								},
							},
							json: true,
						});

						const executionData: INodeExecutionData = { json: response };
						if (hasInputData) {
							executionData.pairedItem = { item: i };
						}
						returnData.push(executionData);
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const executionData: INodeExecutionData = {
						json: {
							error: error.message,
						},
					};
					if (hasInputData) {
						executionData.pairedItem = { item: i };
					}
					returnData.push(executionData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

