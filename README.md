# n8n-nodes-clappia

[![npm version](https://badge.fury.io/js/n8n-nodes-clappia.svg)](https://www.npmjs.com/package/n8n-nodes-clappia)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Official Clappia Integration for n8n** - Developed and maintained by the Clappia team.

This is an n8n community node that lets you integrate [Clappia](https://www.clappia.com) into your n8n workflows.

Clappia is a no-code platform for building custom business applications. This node allows you to create, edit, retrieve, and manage submissions in your Clappia apps directly from n8n.

[n8n](https://n8n.io/) is a fair-code licensed workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Quick Install

1. Go to **Settings > Community Nodes** in your n8n instance
2. Select **Install**
3. Enter `n8n-nodes-clappia` in the **Enter npm package name** field
4. Agree to the [risks](https://docs.n8n.io/integrations/community-nodes/risks/) of using community nodes
5. Select **Install**

After successful installation, the **Clappia** node will appear in your nodes panel.

## Operations

The Clappia node supports the following operations:

### Submission Operations

- **Create**: Create a new submission in a Clappia app
- **Edit**: Update an existing submission
- **Get**: Retrieve a single submission by ID
- **Get Many**: Retrieve multiple submissions with optional filtering
- **Get App Definition**: Get field definitions and metadata for an app
- **Update Status**: Change the status of a submission
- **Update Owners**: Add or modify submission owners

## Credentials

To use this node, you need:

1. **Workplace ID**: Your Clappia workplace identifier
2. **API Key**: Your Clappia API key (x-api-key header)
3. **Requesting User Email**: Email address of the user making API requests

### Getting Your Credentials

1. Log in to your [Clappia account](https://dashboard.auth.clappia.com/)
2. Navigate to **Workplace Settings** > **Preference** > **API Keys**
3. Copy your Workplace ID and API Key
4. In n8n, create new Clappia credentials and paste these values

## Compatibility

- **n8n version**: 1.0.0 or higher
- **Node.js version**: 20.15 or higher

## Usage

### Basic Example: Create a Submission

1. Add a **Manual Trigger** node
2. Add a **Clappia** node
3. Select operation: **Create**
4. Choose your app from the list
5. Select **Data Mode**:
   - **Form (Individual Fields)**: Select fields from dropdown (dynamic loading)
   - **JSON (Advanced)**: Provide raw JSON object

#### Form Mode (Recommended)
```
Data Mode: Form (Individual Fields)
Fields:
  - Field Name: tag (from dropdown)
    Field Value: Personal
  - Field Name: notes (from dropdown)
    Field Value: My note content
```

#### JSON Mode
```json
{
  "tag": "Personal",
  "notes": "My note content",
  "title": "My Title"
}
```

### Dynamic Field Loading

Like the Google Sheets node, the Clappia node dynamically loads available fields after you select an app:

1. **Select an app** - The node fetches app definition
2. **Choose "Form" mode** - Individual field dropdowns appear
3. **Select fields** - See all available fields with labels
4. **Enter values** - Fill in the values for each field

### Using with AI Agents

The Clappia node is AI agent-ready:

```
The node can:
- Automatically discover available fields using "Get App Definition"
- Parse and construct submission data dynamically
- Handle different field types (text, dropdown, multi-line, etc.)
```

## Local Testing

Test your Clappia node locally before publishing:

```bash
# 1. Use Node.js 20.19+ (if using nvm)
nvm use 20.19.5

# 2. Build the node
npm run build

# 3. Start n8n locally
npx n8n@latest

# 4. Open http://localhost:5678 in browser
# 5. Add Clappia credentials: Settings > Credentials > Add credential > Clappia
# 6. Create workflow: Add node > Search "Clappia"
```

**Credentials setup:**
- **Workplace ID**: Your Clappia workplace ID (e.g., API883461)
- **API Key**: Your Clappia API key
- **Email**: Your Clappia account email

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Clappia API Documentation](https://www.clappia.com/help)
* [Clappia Developer Portal](https://developer.clappia.com/)

## Version History

### 0.1.0 (Initial Release)
- ✅ 7 core operations (Create, Edit, Get, Get Many, Get App Definition, Update Status, Update Owners)
- ✅ Dynamic field loading from app definitions
- ✅ Dual input modes (Form + JSON)
- ✅ AI agent support with codex metadata
- ✅ Full TypeScript implementation
- ✅ Comprehensive error handling

## License

[MIT](LICENSE.md)

## Support

- **Issues**: [GitHub Issues](https://github.com/clappia-dev/n8n-nodes-clappia/issues)
- **n8n Community**: [n8n Community Forum](https://community.n8n.io/)
- **Clappia Support**: [Clappia Help Center](https://www.clappia.com/help)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Made with ❤️ for the n8n community**

