// dbt Course Quiz Data
const quizData = [
    {
        question: "What does dbt stand for?",
        options: [
            "Data Build Tool",
            "Database Transformation",
            "Data Business Technology",
            "Digital Build Toolkit"
        ],
        correct: 0,
        explanation: "dbt stands for Data Build Tool. It transforms data inside your warehouse using SQL."
    },
    {
        question: "In the modern data stack, where does dbt fit?",
        options: [
            "It extracts data from sources",
            "It loads data into the warehouse",
            "It transforms data inside the warehouse",
            "It visualizes data in dashboards"
        ],
        correct: 2,
        explanation: "dbt handles the T (Transform) in ELT. It transforms data that's already loaded into your data warehouse."
    },
    {
        question: "What is a dbt model?",
        options: [
            "A machine learning algorithm",
            "A SQL SELECT statement saved in a .sql file",
            "A Python script that processes data",
            "A database schema diagram"
        ],
        correct: 1,
        explanation: "A dbt model is simply a SQL SELECT statement saved in a .sql file. dbt compiles and runs it to create tables or views."
    },
    {
        question: "Which materialization creates a saved query that runs fresh every time it's accessed?",
        options: [
            "Table",
            "View",
            "Incremental",
            "Ephemeral"
        ],
        correct: 1,
        explanation: "A view is a saved query — it doesn't store data physically. The query runs every time someone accesses the view."
    },
    {
        question: "What does {{ ref('stg_customers') }} do in a dbt model?",
        options: [
            "Creates a new table called stg_customers",
            "References the stg_customers model and creates a dependency",
            "Deletes the stg_customers table",
            "Imports a Python module"
        ],
        correct: 1,
        explanation: "ref() references another dbt model by name. It resolves to the correct schema.table and creates a dependency in the DAG."
    },
    {
        question: "What is the purpose of source() in dbt?",
        options: [
            "To create new raw data tables",
            "To declare and reference raw data tables that dbt doesn't manage",
            "To delete source data after transformation",
            "To connect to external APIs"
        ],
        correct: 1,
        explanation: "source() declares raw data tables in your warehouse that dbt reads from but doesn't create. It enables freshness checks and lineage tracking."
    },
    {
        question: "Which dbt test checks that a column has no duplicate values?",
        options: [
            "not_null",
            "accepted_values",
            "unique",
            "relationships"
        ],
        correct: 2,
        explanation: "The 'unique' test ensures every value in a column is distinct — no duplicates allowed."
    },
    {
        question: "What command generates dbt documentation as a website?",
        options: [
            "dbt docs build",
            "dbt docs generate",
            "dbt generate docs",
            "dbt build docs"
        ],
        correct: 1,
        explanation: "'dbt docs generate' creates the documentation website including the lineage graph, model descriptions, and column details."
    },
    {
        question: "What is Jinja in the context of dbt?",
        options: [
            "A data warehouse",
            "A templating language that adds logic to SQL",
            "A testing framework",
            "A deployment tool"
        ],
        correct: 1,
        explanation: "Jinja is a Python-based templating language. In dbt, it lets you add variables, loops, conditionals, and macros to your SQL."
    },
    {
        question: "What is a dbt macro?",
        options: [
            "A type of database index",
            "A reusable Jinja function that generates SQL",
            "A data visualization tool",
            "A warehouse connection type"
        ],
        correct: 1,
        explanation: "A macro is a reusable Jinja function stored in the macros/ folder. You call it in models to generate SQL dynamically."
    },
    {
        question: "What command installs dbt packages listed in packages.yml?",
        options: [
            "dbt install",
            "dbt packages",
            "dbt deps",
            "dbt get"
        ],
        correct: 2,
        explanation: "'dbt deps' (short for dependencies) downloads and installs all packages listed in your packages.yml file."
    },
    {
        question: "What are dbt seeds?",
        options: [
            "Raw data from external APIs",
            "CSV files loaded into the warehouse as tables",
            "Database connection credentials",
            "Automated test scripts"
        ],
        correct: 1,
        explanation: "Seeds are CSV files in your seeds/ folder that dbt loads into your warehouse as tables. They're ideal for small, static reference data."
    },
    {
        question: "In the 3-layer architecture, what is the correct order?",
        options: [
            "Marts → Staging → Intermediate",
            "Intermediate → Staging → Marts",
            "Staging → Intermediate → Marts",
            "Staging → Marts → Intermediate"
        ],
        correct: 2,
        explanation: "The standard dbt architecture flows: Staging (clean raw data) → Intermediate (business logic) → Marts (final tables for end users)."
    },
    {
        question: "What does is_incremental() check in a dbt model?",
        options: [
            "If the model is running for the first time",
            "If the model already exists and this is NOT a full refresh",
            "If the data warehouse is connected",
            "If tests have passed"
        ],
        correct: 1,
        explanation: "is_incremental() returns true when the model already exists in the warehouse AND the run is not a --full-refresh. It's used to process only new/changed data."
    },
    {
        question: "What file stores your warehouse connection credentials?",
        options: [
            "dbt_project.yml",
            "schema.yml",
            "profiles.yml",
            "packages.yml"
        ],
        correct: 2,
        explanation: "profiles.yml (stored in ~/.dbt/) contains your warehouse connection details including host, port, credentials, and target schemas."
    },
    {
        question: "Who created dbt?",
        options: [
            "Jeff Bezos at Amazon",
            "Drew Banin at RJMetrics / Fishtown Analytics",
            "Larry Page at Google",
            "Satya Nadella at Microsoft"
        ],
        correct: 1,
        explanation: "Drew Banin created dbt while working at RJMetrics. He later co-founded Fishtown Analytics (now dbt Labs) to commercialize it."
    },
    {
        question: "What is the DAG in dbt?",
        options: [
            "Data Analysis Graph — a chart of metrics",
            "Directed Acyclic Graph — the dependency tree of models",
            "Database Access Gateway — a connection manager",
            "Dynamic Aggregation Generator — a macro system"
        ],
        correct: 1,
        explanation: "The DAG (Directed Acyclic Graph) shows how models depend on each other. dbt uses it to determine the correct build order."
    },
    {
        question: "What is the difference between ETL and ELT?",
        options: [
            "ETL is newer than ELT",
            "In ETL, transformation happens before loading; in ELT, it happens after loading",
            "ETL uses SQL; ELT uses Python",
            "There is no difference"
        ],
        correct: 1,
        explanation: "In ETL, data is transformed before loading into the warehouse. In ELT (which dbt uses), data is loaded first, then transformed inside the warehouse."
    },
    {
        question: "What does 'dbt build' do?",
        options: [
            "Only runs models",
            "Only runs tests",
            "Runs models, tests, snapshots, and seeds in dependency order",
            "Generates documentation"
        ],
        correct: 2,
        explanation: "'dbt build' is the all-in-one command that runs seeds, models, snapshots, and tests in the correct dependency order."
    },
    {
        question: "What is a dbt exposure?",
        options: [
            "A security vulnerability in your data",
            "A declaration of downstream consumers like dashboards and ML models",
            "A type of materialization",
            "An error in your dbt project"
        ],
        correct: 1,
        explanation: "Exposures declare downstream consumers (dashboards, reports, ML models) that depend on your dbt models. They appear in the lineage graph."
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = quizData;
}
