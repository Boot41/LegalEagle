# LegalEagle 

LegalEagle is a comprehensive compliance management application designed to streamline the process of managing compliance rules, action items, and document uploads. The application features a modern UI with a dark theme, robust backend services, and seamless integration with Gmail for email notifications.

## Features

- **Dashboard:** Centralized view for managing compliance insights and document uploads.
- **Compliance Rule Manager:** Create, update, and manage compliance rules with detailed compliance results.
- **Action Items:** Assign and track action items with email notifications.
- **Document Upload:** Upload and validate documents with progress bar visualization for risk scores.
- **Compliance Details Modal:** Detailed insights into compliance status and results.

## Project Structure

### Client
- **Components:**
  - `Dashboard.tsx`: Main dashboard component.
  - `ComplianceRuleManager.tsx`: Manage compliance rules.
  - `ActionItems.tsx`: Manage and assign action items.
  - `ComplianceDetailsModal.tsx`: Detailed compliance insights modal.

### Server
- **Services:**
  - `action_service.go`: Handles action item assignments and email notifications.
- **Models:**
  - `actionItem.go`: Defines the ActionItem model.
- **Migrations:**
  - `004_create_action_items.up.sql`: Migration script for creating action items table.

## Dependencies

### Frontend
- **React:** JavaScript library for building user interfaces.
- **Framer Motion:** Animation library for React.
- **Tailwind CSS:** Utility-first CSS framework.

### Backend
- **Gin:** HTTP web framework for Go.
- **GORM:** ORM library for Go.
- **Gmail SMTP:** For sending email notifications.

## Setup Instructions

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/legaleagle.git
   cd legaleagle
   ```

2. **Install Dependencies:**
   - **Frontend:**
     ```bash
     cd client
     npm install
     ```
   - **Backend:**
     ```bash
     cd server
     go mod download
     ```

3. **Set Environment Variables:**
   Create a `.env` file in the `server` directory with the following variables:
   ```
   GMAIL_EMAIL=your-email@gmail.com
   GMAIL_PASSWORD=your-email-password
   ```

4. **Run Migrations:**
   ```bash
   cd server
   go run main.go migrate
   ```

5. **Start the Application:**
   - **Frontend:**
     ```bash
     cd client
     npm start
     ```
   - **Backend:**
     ```bash
     cd server
     go run main.go
     ```

## Testing
First, install the required testing tools:
```bash
go install github.com/agiledragon/gomonkey/v2@latest
go install github.com/kyoh86/richgo@latest
export PATH=$PATH:$(go env GOPATH)/bin
source ~/.bashrc
```

### Normal Tests
```bash
# Verbose testing
richgo test -v ./...

# Count of tests
richgo test -v ./... 2>&1 | grep '^=== RUN' | wc -l
```

### Coverage Report
```bash
richgo test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out
```

## Usage

1. **Dashboard:**
   - View and manage compliance insights.
   - Upload and validate documents.

2. **Compliance Rule Manager:**
   - Create and update compliance rules.
   - View detailed compliance results.

3. **Action Items:**
   - Assign action items to users.
   - Track the status of action items.

4. **Document Upload:**
   - Upload documents and view risk scores.
   - See progress bar visualization for risk scores.

## Contribution Guidelines

We welcome contributions to LegalEagle! Please follow these guidelines:

1. **Fork the Repository:**
   - Fork the repository and create a new branch for your feature or bug fix.

2. **Submit a Pull Request:**
   - Ensure your code follows the project's coding standards.
   - Include a detailed description of your changes in the pull request.

3. **Testing:**
   - Ensure all new features are thoroughly tested.
   - Include unit tests where applicable.

## License

LegalEagle is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
