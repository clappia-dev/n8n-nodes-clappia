import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ClappiaApi implements ICredentialType {
	name = 'clappiaApi';
	displayName = 'Clappia API';
	documentationUrl = 'https://developer.clappia.com/';
	httpRequestNode = {
		name: 'Clappia',
		docsUrl: 'https://developer.clappia.com/',
		apiBaseUrl: 'https://api-public-v3.clappia.com',
	};
	properties: INodeProperties[] = [
		{
			displayName: 'Workplace ID',
			name: 'workplaceId',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'YOUR_WORKPLACE_ID',
			description: 'Your Clappia Workplace ID',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			placeholder: 'YOUR_WORKPLACE_API_KEY',
			description: 'Your Clappia API Key (x-api-key header)',
		},
		{
			displayName: 'Requesting User Email',
			name: 'requestingUserEmailAddress',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'your@email.com',
			description: 'Email address of the user making API requests (required by Clappia API)',
		},
	];

	// This allows the credential to be used by other parts of n8n
	// The x-api-key is sent as a header for Clappia API authentication
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'x-api-key': '={{$credentials.apiKey}}',
			},
		},
	};

	// Test the credentials by fetching workplace apps
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api-public-v3.clappia.com',
			url: '=/workplace/getApps?workplaceId={{$credentials.workplaceId}}',
			method: 'GET',
			headers: {
				'workplaceId': '={{$credentials.workplaceId}}',
				'Content-Type': 'application/json',
			},
		},
	};
}


