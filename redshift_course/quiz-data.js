// Terraform Course Quiz Data
const quizData = [
    {
        question: "What does IaC stand for in the context of Terraform?",
        options: [
            "Infrastructure as Code",
            "Internet as Code", 
            "Integration as Code",
            "Installation as Code"
        ],
        correct: 0,
        explanation: "IaC stands for Infrastructure as Code, which is the practice of managing and provisioning computing infrastructure through machine-readable definition files."
    },
    {
        question: "Who founded HashiCorp, the company behind Terraform?",
        options: [
            "Linus Torvalds",
            "Mitchell Hashimoto and Armon Dadgar",
            "Jeff Bezos",
            "Elon Musk"
        ],
        correct: 1,
        explanation: "Mitchell Hashimoto and Armon Dadgar founded HashiCorp in 2014, with Terraform being one of their flagship products."
    },
    {
        question: "In what year was Terraform first released?",
        options: [
            "2013",
            "2014", 
            "2015",
            "2016"
        ],
        correct: 1,
        explanation: "Terraform 0.1.0 was first released on July 28, 2014, introducing Infrastructure as Code to the world."
    },
    {
        question: "What is the correct sequence of Terraform workflow?",
        options: [
            "Plan → Write → Apply",
            "Apply → Plan → Write",
            "Write → Plan → Apply",
            "Write → Apply → Plan"
        ],
        correct: 2,
        explanation: "The Terraform workflow is: Write (define infrastructure), Plan (preview changes), Apply (create/update infrastructure)."
    },
    {
        question: "What file extension do Terraform configuration files use?",
        options: [
            ".tf",
            ".terraform",
            ".hcl", 
            ".config"
        ],
        correct: 0,
        explanation: "Terraform configuration files use the .tf extension and are written in HashiCorp Configuration Language (HCL)."
    },
    {
        question: "Which command initializes a new or existing Terraform configuration?",
        options: [
            "terraform start",
            "terraform begin",
            "terraform init",
            "terraform create"
        ],
        correct: 2,
        explanation: "The 'terraform init' command initializes a Terraform configuration, downloading required providers and modules."
    },
    {
        question: "What does 'terraform plan' do?",
        options: [
            "Creates infrastructure immediately",
            "Shows what changes Terraform will make",
            "Destroys existing infrastructure", 
            "Updates Terraform to the latest version"
        ],
        correct: 1,
        explanation: "The 'terraform plan' command creates an execution plan, showing what actions Terraform will take to reach the desired state."
    },
    {
        question: "In Terraform, what is a 'provider'?",
        options: [
            "A person who provides Terraform support",
            "A plugin that defines and manages resources for a specific platform",
            "A cloud service provider only",
            "A type of Terraform module"
        ],
        correct: 1,
        explanation: "A provider in Terraform is a plugin that defines resource types and data sources for a specific platform (AWS, Azure, etc.)."
    },
    {
        question: "What is the purpose of Terraform state?",
        options: [
            "To store user passwords",
            "To track the current state of infrastructure",
            "To backup Terraform code",
            "To store provider credentials"
        ],
        correct: 1,
        explanation: "Terraform state tracks the current state of your infrastructure, mapping real resources to your configuration."
    },
    {
        question: "Which major version introduced stability guarantees and backwards compatibility?",
        options: [
            "Terraform 0.15",
            "Terraform 0.12",
            "Terraform 1.0", 
            "Terraform 2.0"
        ],
        correct: 2,
        explanation: "Terraform 1.0, released in 2021, introduced stability guarantees and backwards compatibility promises."
    },
    {
        question: "What is a Terraform module?",
        options: [
            "A container for multiple resources used together",
            "A single resource definition",
            "A provider plugin",
            "A state file"
        ],
        correct: 0,
        explanation: "A Terraform module is a container for multiple resources that are used together, promoting code reuse and organization."
    },
    {
        question: "Which company famously uses Terraform to manage their global streaming infrastructure?",
        options: [
            "Disney+",
            "Amazon Prime",
            "Netflix",
            "Hulu"
        ],
        correct: 2,
        explanation: "Netflix uses Terraform extensively to manage their global streaming infrastructure across multiple cloud regions."
    },
    {
        question: "What is the default backend for Terraform state storage?",
        options: [
            "Amazon S3",
            "Local filesystem",
            "Azure Blob Storage",
            "Google Cloud Storage"
        ],
        correct: 1,
        explanation: "By default, Terraform stores state locally in a file named terraform.tfstate in your working directory."
    },
    {
        question: "What command would you use to format your Terraform code?",
        options: [
            "terraform format",
            "terraform fmt",
            "terraform style",
            "terraform beautify"
        ],
        correct: 1,
        explanation: "The 'terraform fmt' command automatically formats Terraform configuration files to a canonical format."
    },
    {
        question: "In Terraform, what are 'data sources' used for?",
        options: [
            "To create new resources",
            "To fetch information about existing resources",
            "To destroy resources",
            "To validate configuration"
        ],
        correct: 1,
        explanation: "Data sources in Terraform allow you to fetch information about existing resources or infrastructure that exists outside of Terraform."
    },
    {
        question: "What is Terraform Cloud primarily used for?",
        options: [
            "Writing Terraform code",
            "Remote state management and collaboration",
            "Installing Terraform",
            "Creating cloud accounts"
        ],
        correct: 1,
        explanation: "Terraform Cloud provides remote state management, collaborative workflows, and advanced features for teams using Terraform."
    },
    {
        question: "Which of these is a best practice for Terraform state files?",
        options: [
            "Store them in version control",
            "Share them via email",
            "Use remote backend storage",
            "Delete them after each run"
        ],
        correct: 2,
        explanation: "Using remote backend storage (like S3, Azure Storage, etc.) is a best practice for storing Terraform state files securely."
    },
    {
        question: "What does the 'terraform destroy' command do?",
        options: [
            "Deletes Terraform installation",
            "Destroys all resources managed by Terraform",
            "Removes the state file",
            "Uninstalls providers"
        ],
        correct: 1,
        explanation: "The 'terraform destroy' command destroys all resources that are managed by the current Terraform configuration."
    },
    {
        question: "In Terraform HCL syntax, how do you define a variable?",
        options: [
            "var \"name\" { }",
            "variable \"name\" { }",
            "define \"name\" { }",
            "param \"name\" { }"
        ],
        correct: 1,
        explanation: "In Terraform, variables are defined using the 'variable' keyword followed by the variable name in quotes."
    },
    {
        question: "What is the maximum number of resources Terraform can manage in a single state file?",
        options: [
            "1,000 resources",
            "10,000 resources",
            "There is no hard limit",
            "100,000 resources"
        ],
        correct: 2,
        explanation: "There is no hard limit on the number of resources Terraform can manage, though performance may be impacted with very large state files."
    }
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = quizData;
}