import { INodeProperties } from 'n8n-workflow';

// Operations for the submission resource
export const submissionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['submission'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new submission in a Clappia app',
				action: 'Create a submission',
			},
			{
				name: 'Edit',
				value: 'edit',
				description: 'Edit an existing submission in a Clappia app',
				action: 'Edit a submission',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a single submission by ID',
				action: 'Get a submission',
			},
			{
				name: 'Get App Definition',
				value: 'getAppDefinition',
				description: 'Get app field definitions (field IDs, labels, types, etc.)',
				action: 'Get app definition',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get multiple submissions from a Clappia app',
				action: 'Get many submissions',
			},
			{
				name: 'Update Owners',
				value: 'getOwner',
				description: 'Update the owners of a submission',
				action: 'Update submission owners',
			},
			{
				name: 'Update Status',
				value: 'updateStatus',
				description: 'Update the status of a submission',
				action: 'Update submission status',
			},
		],
		default: 'create',
	},
];

// Fields for Create operation
const createOperation: INodeProperties[] = [
	{
		displayName: 'App',
		name: 'appId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'The Clappia app to create submission in',
		displayOptions: {
			show: {
				resource: ['submission'],
				operation: ['create'],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getApps',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '[a-zA-Z0-9]+',
							errorMessage: 'Not a valid Clappia App ID',
						},
					},
				],
				placeholder: 'e.g. 5f9e3b1c2e1f4a0017a1b2c3',
			},
		],
	},
	{
		displayName: 'Data Mode',
		name: 'dataMode',
		type: 'options',
		options: [
			{
				name: 'Form (Individual Fields)',
				value: 'form',
				description: 'Fill in individual fields dynamically loaded from the app',
			},
			{
				name: 'JSON (Advanced)',
				value: 'json',
				description: 'Provide all data as a JSON object',
			},
		],
		default: 'form',
		description: 'Choose how to input submission data',
		displayOptions: {
			show: {
				resource: ['submission'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Fields',
		name: 'fields',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		placeholder: 'Add Field',
		description: 'The fields to submit',
		displayOptions: {
			show: {
				resource: ['submission'],
				operation: ['create'],
				dataMode: ['form'],
			},
		},
		options: [
			{
				name: 'field',
				displayName: 'Field',
				values: [
					{
						displayName: 'Field Name or ID',
						name: 'name',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getAppFields',
						},
						default: '',
						description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
					},
					{
						displayName: 'Field Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'The value to set for this field',
					},
				],
			},
		],
	},
	{
		displayName: 'Submission Data',
		name: 'submissionData',
		type: 'json',
		default: '{}',
		required: true,
		description: 'The submission data as JSON object. Use field IDs (like "tag", "notes", "title") as keys and provide values. Get field IDs from "Get App Definition" operation first.',
		hint: 'Tip: Run "Get App Definition" first to see all available field IDs and their types for this app',
		placeholder: '{"tag": "Personal", "notes": "My note content", "title": "My Title"}',
		displayOptions: {
			show: {
				resource: ['submission'],
				operation: ['create'],
				dataMode: ['json'],
			},
		},
	},
];

// Fields for Get Many operation
const getManyOperation: INodeProperties[] = [
	{
		displayName: 'App',
		name: 'appId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'The Clappia app to get submissions from',
		displayOptions: {
			show: {
				resource: ['submission'],
				operation: ['getMany'],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getApps',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '[a-zA-Z0-9]+',
							errorMessage: 'Not a valid Clappia App ID',
						},
					},
				],
				placeholder: 'e.g. 5f9e3b1c2e1f4a0017a1b2c3',
			},
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['submission'],
				operation: ['getMany'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		description: 'Max number of results to return',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				resource: ['submission'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['submission'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Filter by Custom Field',
				name: 'filterByCustomField',
				type: 'fixedCollection',
				default: {},
				description: 'Filter submissions by custom field value using CONTAINS operator',
				typeOptions: {
					multipleValues: true,
				},
				options: [
					{
						name: 'customFilters',
						displayName: 'Custom Filter',
						values: [
							{
								displayName: 'Field ID',
								name: 'fieldId',
								type: 'string',
								default: '',
								description: 'The Clappia field ID to filter by',
								placeholder: 'e.g. single_line_text',
							},
							{
								displayName: 'Field Value',
								name: 'fieldValue',
								type: 'string',
								default: '',
								description: 'The value to filter by (CONTAINS operator)',
								placeholder: 'e.g. Some Text',
							},
						],
					},
				],
			},
		],
	},
];

// Fields for Edit operation
const editOperation: INodeProperties[] = [
	{
		displayName: 'App',
		name: 'appId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'The Clappia app containing the submission',
		displayOptions: {
			show: {
				resource: ['submission'],
				operation: ['edit'],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getApps',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '[a-zA-Z0-9]+',
							errorMessage: 'Not a valid Clappia App ID',
						},
					},
				],
				placeholder: 'e.g. 5f9e3b1c2e1f4a0017a1b2c3',
			},
		],
	},
	{
		displayName: 'Submission ID',
		name: 'submissionId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the submission to edit',
		placeholder: 'e.g. 5f9e3b1c2e1f4a0017a1b2c3',
		displayOptions: {
			show: {
				resource: ['submission'],
				operation: ['edit'],
			},
		},
	},
	{
		displayName: 'Data Mode',
		name: 'dataMode',
		type: 'options',
		options: [
			{
				name: 'Form (Individual Fields)',
				value: 'form',
				description: 'Edit individual fields dynamically loaded from the app',
			},
			{
				name: 'JSON (Advanced)',
				value: 'json',
				description: 'Provide all data as a JSON object',
			},
		],
		default: 'form',
		description: 'Choose how to input edit data',
		displayOptions: {
			show: {
				resource: ['submission'],
				operation: ['edit'],
			},
		},
	},
	{
		displayName: 'Fields',
		name: 'fields',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		placeholder: 'Add Field',
		description: 'The fields to update',
		displayOptions: {
			show: {
				resource: ['submission'],
				operation: ['edit'],
				dataMode: ['form'],
			},
		},
		options: [
			{
				name: 'field',
				displayName: 'Field',
				values: [
					{
						displayName: 'Field Name or ID',
						name: 'name',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getAppFields',
						},
						default: '',
						description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
					},
					{
						displayName: 'Field Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'The new value for this field',
					},
				],
			},
		],
	},
	{
		displayName: 'Edit Data',
		name: 'editData',
		type: 'json',
		default: '{}',
		required: true,
		description: 'The fields to update as JSON object. Use field IDs (like "tag", "notes", "title") as keys and provide new values. Only the fields you include will be updated.',
		hint: 'Tip: Run "Get App Definition" first to see all available field IDs for this app',
		placeholder: '{"notes": "Updated note", "tag": "Work"}',
		displayOptions: {
			show: {
				resource: ['submission'],
				operation: ['edit'],
				dataMode: ['json'],
			},
		},
	},
];

// Fields for Get operation (single submission)
const getOperation: INodeProperties[] = [
	{
		displayName: 'App',
		name: 'appId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'The Clappia app containing the submission',
		displayOptions: {
			show: {
				resource: ['submission'],
				operation: ['get'],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getApps',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '[a-zA-Z0-9]+',
							errorMessage: 'Not a valid Clappia App ID',
						},
					},
				],
				placeholder: 'e.g. 5f9e3b1c2e1f4a0017a1b2c3',
			},
		],
	},
	{
		displayName: 'Submission ID',
		name: 'submissionId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the submission to retrieve',
		placeholder: 'e.g. 5f9e3b1c2e1f4a0017a1b2c3',
		displayOptions: {
			show: {
				resource: ['submission'],
				operation: ['get'],
			},
		},
	},
];

// Fields for Update Owners operation
const getOwnerOperation: INodeProperties[] = [
	{
		displayName: 'App',
		name: 'appId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'The Clappia app containing the submission',
		displayOptions: {
			show: {
				resource: ['submission'],
				operation: ['getOwner'],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getApps',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '[a-zA-Z0-9]+',
							errorMessage: 'Not a valid Clappia App ID',
						},
					},
				],
				placeholder: 'e.g. 5f9e3b1c2e1f4a0017a1b2c3',
			},
		],
	},
	{
		displayName: 'Submission ID',
		name: 'submissionId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the submission to update owners for',
		placeholder: 'e.g. XNP68547738',
		displayOptions: {
			show: {
				resource: ['submission'],
				operation: ['getOwner'],
			},
		},
	},
	{
		displayName: 'Owner Email IDs',
		name: 'emailIds',
		type: 'string',
		default: '',
		required: true,
		description: 'Comma-separated list of email addresses to set as submission owners',
		placeholder: 'e.g. a@clappia.com, support@clappia.com',
		displayOptions: {
			show: {
				resource: ['submission'],
				operation: ['getOwner'],
			},
		},
	},
];

// Fields for Update Status operation
const updateStatusOperation: INodeProperties[] = [
	{
		displayName: 'App',
		name: 'appId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'The Clappia app containing the submission',
		displayOptions: {
			show: {
				resource: ['submission'],
				operation: ['updateStatus'],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getApps',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '[a-zA-Z0-9]+',
							errorMessage: 'Not a valid Clappia App ID',
						},
					},
				],
				placeholder: 'e.g. 5f9e3b1c2e1f4a0017a1b2c3',
			},
		],
	},
	{
		displayName: 'Submission ID',
		name: 'submissionId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the submission to update status for',
		placeholder: 'e.g. 5f9e3b1c2e1f4a0017a1b2c3',
		displayOptions: {
			show: {
				resource: ['submission'],
				operation: ['updateStatus'],
			},
		},
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'string',
		default: '',
		required: true,
		description: 'The new status name for the submission',
		placeholder: 'e.g. Approved, Rejected, Pending',
		displayOptions: {
			show: {
				resource: ['submission'],
				operation: ['updateStatus'],
			},
		},
	},
	{
		displayName: 'Status Comments',
		name: 'statusComments',
		type: 'string',
		default: '',
		description: 'Optional comments for the status update',
		placeholder: 'e.g. All documents verified and approved for processing',
		displayOptions: {
			show: {
				resource: ['submission'],
				operation: ['updateStatus'],
			},
		},
	},
];

// Fields for Get App Definition operation
const getAppDefinitionOperation: INodeProperties[] = [
	{
		displayName: 'App',
		name: 'appId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'The Clappia app to get field definitions for',
		displayOptions: {
			show: {
				resource: ['submission'],
				operation: ['getAppDefinition'],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getApps',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '[a-zA-Z0-9]+',
							errorMessage: 'Not a valid Clappia App ID',
						},
					},
				],
				placeholder: 'e.g. WUU023539',
			},
		],
	},
];

export const submissionFields: INodeProperties[] = [
	...createOperation,
	...editOperation,
	...getOperation,
	...getAppDefinitionOperation,
	...getManyOperation,
	...getOwnerOperation,
	...updateStatusOperation,
];

