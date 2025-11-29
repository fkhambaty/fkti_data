// Quiz Data for Python Learning Website

// Subsection Quizzes (after each lesson)
const subsectionQuizzes = {
    'step1': {
        question: "What does the print() function do in Python?",
        options: [
            "Prints documents on paper",
            "Displays text on the screen",
            "Saves files to disk",
            "Deletes code"
        ],
        correct: 1,
        explanation: "The print() function displays text on the screen/console."
    },
    'step2': {
        question: "Which of the following is a valid variable name in Python?",
        options: [
            "2students",
            "student-name",
            "student_name",
            "student name"
        ],
        correct: 2,
        explanation: "Variable names can contain letters, numbers, and underscores, but cannot start with a number or contain spaces/hyphens."
    },
    'step3': {
        question: "What data type is the value 23.5?",
        options: [
            "Integer",
            "String",
            "Float",
            "Boolean"
        ],
        correct: 2,
        explanation: "23.5 is a decimal number, which is represented as a 'float' (floating-point number) in Python."
    },
    'step4': {
        question: "What is the result of 17 % 5 in Python?",
        options: [
            "3.4",
            "2",
            "5",
            "17"
        ],
        correct: 1,
        explanation: "The % operator (modulo) returns the remainder after division. 17 divided by 5 is 3 with remainder 2."
    },
    'step5': {
        question: "How do you access the first element in a Python list?",
        options: [
            "list[1]",
            "list[0]",
            "list.first()",
            "list[-1]"
        ],
        correct: 1,
        explanation: "Python uses zero-based indexing, so the first element is at index 0."
    },
    'step6': {
        question: "In a dictionary, what do we call the labels used to access values?",
        options: [
            "Indexes",
            "Tags",
            "Keys",
            "Names"
        ],
        correct: 2,
        explanation: "Dictionary items are accessed using 'keys'. Each key maps to a value."
    },
    'step7': {
        question: "What will this code print? if 75 >= 60: print('Pass')",
        options: [
            "Nothing",
            "Pass",
            "Fail",
            "Error"
        ],
        correct: 1,
        explanation: "75 is greater than or equal to 60, so the condition is True and 'Pass' is printed."
    },
    'step8': {
        question: "What does 'for item in [1, 2, 3]:' do?",
        options: [
            "Prints numbers 1 to 3",
            "Repeats code 3 times, with item taking values 1, 2, 3",
            "Creates a list",
            "Checks if numbers exist"
        ],
        correct: 1,
        explanation: "A for loop iterates through each item in the list, executing the loop body for each value."
    },
    'step9': {
        question: "What's the risk with while loops?",
        options: [
            "They run too fast",
            "They use too much memory",
            "They can run forever if condition never becomes false",
            "They only work with numbers"
        ],
        correct: 2,
        explanation: "While loops can create infinite loops if the exit condition is never met."
    },
    'step10': {
        question: "What keyword is used to return a value from a function?",
        options: [
            "give",
            "return",
            "output",
            "send"
        ],
        correct: 1,
        explanation: "The 'return' keyword is used to send a value back from a function."
    },
    'step11': {
        question: "What's a key benefit of using functions?",
        options: [
            "Makes code run faster",
            "Reusable code without rewriting",
            "Uses less memory",
            "Prevents all bugs"
        ],
        correct: 1,
        explanation: "Functions allow you to write code once and reuse it multiple times, making your code more organized and maintainable."
    },
    'step12': {
        question: "What library is best for fast numerical calculations on large datasets?",
        options: [
            "Pandas",
            "Matplotlib",
            "NumPy",
            "Requests"
        ],
        correct: 2,
        explanation: "NumPy is optimized for fast numerical operations on arrays and matrices."
    },
    'step13': {
        question: "What is a Pandas DataFrame similar to?",
        options: [
            "A Python list",
            "A text file",
            "An Excel spreadsheet",
            "A calculator"
        ],
        correct: 2,
        explanation: "A DataFrame is like a table or spreadsheet, with rows and columns of data."
    },
    'step14': {
        question: "Which chart type is best for showing trends over time?",
        options: [
            "Pie chart",
            "Line chart",
            "Scatter plot",
            "Bar chart"
        ],
        correct: 1,
        explanation: "Line charts are ideal for displaying data trends over time periods."
    },
    'step15': {
        question: "In data analysis, what does 'mean' refer to?",
        options: [
            "The middle value",
            "The most common value",
            "The average value",
            "The highest value"
        ],
        correct: 2,
        explanation: "Mean is the average - the sum of all values divided by the count."
    },
    'step16': {
        question: "What does 'pct_change()' calculate in Pandas?",
        options: [
            "Percentage of total",
            "Percentage change from previous value",
            "Count of changes",
            "Price changes only"
        ],
        correct: 1,
        explanation: "pct_change() calculates the percentage change between consecutive values."
    },
    'step17': {
        question: "What type of machine learning predicts continuous values?",
        options: [
            "Classification",
            "Clustering",
            "Regression",
            "Association"
        ],
        correct: 2,
        explanation: "Regression models predict continuous numerical values, like house prices or temperatures."
    }
};

// Major Section Quizzes (at end of each main section)
const sectionQuizzes = {
    'basics': {
        title: "🎯 Basics Section Quiz",
        questions: [
            {
                question: "What will be the output of: print(type(42))?",
                options: [
                    "<class 'str'>",
                    "<class 'int'>",
                    "<class 'float'>",
                    "<class 'number'>"
                ],
                correct: 1,
                explanation: "42 is a whole number, so it's an integer (int) type."
            },
            {
                question: "Which operator is used for exponentiation (power) in Python?",
                options: [
                    "^",
                    "**",
                    "pow",
                    "//"
                ],
                correct: 1,
                explanation: "The ** operator is used for exponentiation. For example, 2**3 = 8."
            },
            {
                question: "What is the result of: 10 + 5 * 2?",
                options: [
                    "30",
                    "20",
                    "15",
                    "25"
                ],
                correct: 1,
                explanation: "Following order of operations (PEMDAS), multiplication happens first: 5*2=10, then 10+10=20."
            },
            {
                question: "Which of these is NOT a valid Python data type?",
                options: [
                    "int",
                    "float",
                    "decimal",
                    "bool"
                ],
                correct: 2,
                explanation: "While decimal exists as a module, the basic numeric types are int, float, and bool (not 'decimal' as a built-in type)."
            },
            {
                question: "What does this code do: x = '5'; y = 3; result = x + y?",
                options: [
                    "Results in 8",
                    "Results in '53'",
                    "Causes an error",
                    "Results in 15"
                ],
                correct: 2,
                explanation: "You cannot add a string and an integer directly in Python. This causes a TypeError."
            }
        ]
    },
    'data': {
        title: "🎯 Data Structures Quiz",
        questions: [
            {
                question: "What is the index of the last element in: fruits = ['apple', 'banana', 'orange']?",
                options: [
                    "0",
                    "1",
                    "2",
                    "3"
                ],
                correct: 2,
                explanation: "Lists use zero-based indexing. With 3 items, indexes are 0, 1, and 2."
            },
            {
                question: "How do you add an item to the end of a list?",
                options: [
                    "list.add(item)",
                    "list.append(item)",
                    "list.insert(item)",
                    "list.push(item)"
                ],
                correct: 1,
                explanation: "The append() method adds an item to the end of a list."
            },
            {
                question: "What does len([10, 20, 30, 40]) return?",
                options: [
                    "3",
                    "4",
                    "40",
                    "100"
                ],
                correct: 1,
                explanation: "len() returns the number of items in the list, which is 4."
            },
            {
                question: "In a dictionary person = {'name': 'Alice', 'age': 25}, how do you get the age?",
                options: [
                    "person.age",
                    "person['age']",
                    "person(age)",
                    "person->age"
                ],
                correct: 1,
                explanation: "Dictionary values are accessed using square brackets with the key: person['age']."
            },
            {
                question: "What does sum([1, 2, 3, 4, 5]) return?",
                options: [
                    "5",
                    "10",
                    "15",
                    "Error"
                ],
                correct: 2,
                explanation: "sum() adds all numbers in the list: 1+2+3+4+5 = 15."
            }
        ]
    },
    'control': {
        title: "🎯 Control Flow Quiz",
        questions: [
            {
                question: "What is the output? x = 10; if x > 5: print('A'); elif x > 15: print('B'); else: print('C')",
                options: [
                    "A",
                    "B",
                    "C",
                    "AB"
                ],
                correct: 0,
                explanation: "x (10) is greater than 5, so 'A' is printed. Once a condition is true, other elif/else blocks are skipped."
            },
            {
                question: "How many times will this loop run? for i in range(5): print(i)",
                options: [
                    "4 times",
                    "5 times",
                    "6 times",
                    "Infinite"
                ],
                correct: 1,
                explanation: "range(5) generates numbers 0, 1, 2, 3, 4 (5 numbers total)."
            },
            {
                question: "What does 'break' do in a loop?",
                options: [
                    "Pauses the loop",
                    "Skips current iteration",
                    "Exits the loop completely",
                    "Crashes the program"
                ],
                correct: 2,
                explanation: "'break' immediately exits the loop, regardless of the loop condition."
            },
            {
                question: "What operator checks if two values are equal?",
                options: [
                    "=",
                    "==",
                    "===",
                    "eq"
                ],
                correct: 1,
                explanation: "== is the equality comparison operator. = is for assignment."
            },
            {
                question: "What will this print? for i in [1,2,3]: if i == 2: continue; print(i)",
                options: [
                    "1 2 3",
                    "1 3",
                    "2",
                    "3"
                ],
                correct: 1,
                explanation: "'continue' skips the rest of the current iteration. So 2 is skipped, printing only 1 and 3."
            }
        ]
    },
    'functions': {
        title: "🎯 Functions Quiz",
        questions: [
            {
                question: "What is the correct syntax to define a function?",
                options: [
                    "function myFunc():",
                    "def myFunc():",
                    "create myFunc():",
                    "func myFunc():"
                ],
                correct: 1,
                explanation: "Functions are defined using the 'def' keyword followed by the function name and parentheses."
            },
            {
                question: "What does this function return? def add(a, b): return a + b",
                options: [
                    "Nothing",
                    "The sum of a and b",
                    "The product of a and b",
                    "An error"
                ],
                correct: 1,
                explanation: "The function returns the sum (addition) of parameters a and b."
            },
            {
                question: "How do you call a function named 'greet' with argument 'Alice'?",
                options: [
                    "call greet('Alice')",
                    "greet('Alice')",
                    "run greet('Alice')",
                    "execute greet('Alice')"
                ],
                correct: 1,
                explanation: "Functions are called by their name followed by parentheses containing any arguments."
            },
            {
                question: "What happens if a function doesn't have a return statement?",
                options: [
                    "Error occurs",
                    "Returns 0",
                    "Returns None",
                    "Returns empty string"
                ],
                correct: 2,
                explanation: "Functions without an explicit return statement return None by default."
            },
            {
                question: "Can a function call another function?",
                options: [
                    "No, never",
                    "Yes, always",
                    "Only built-in functions",
                    "Only if they're in the same file"
                ],
                correct: 1,
                explanation: "Functions can call other functions - this is a fundamental programming concept."
            }
        ]
    },
    'libraries': {
        title: "🎯 Libraries Quiz",
        questions: [
            {
                question: "How do you import NumPy with the standard alias?",
                options: [
                    "import numpy",
                    "import numpy as np",
                    "from numpy import *",
                    "include numpy"
                ],
                correct: 1,
                explanation: "The standard convention is: import numpy as np"
            },
            {
                question: "Which library is specifically designed for data manipulation and analysis?",
                options: [
                    "NumPy",
                    "Matplotlib",
                    "Pandas",
                    "Requests"
                ],
                correct: 2,
                explanation: "Pandas is specifically designed for data manipulation and analysis with DataFrames."
            },
            {
                question: "What does df.head() do in Pandas?",
                options: [
                    "Returns the first row",
                    "Returns the first 5 rows",
                    "Returns the column names",
                    "Returns the data types"
                ],
                correct: 1,
                explanation: "head() returns the first 5 rows of a DataFrame by default."
            },
            {
                question: "Which Matplotlib function displays a chart?",
                options: [
                    "plt.display()",
                    "plt.render()",
                    "plt.show()",
                    "plt.draw()"
                ],
                correct: 2,
                explanation: "plt.show() displays the created matplotlib chart."
            },
            {
                question: "What does np.mean() calculate?",
                options: [
                    "Median",
                    "Mode",
                    "Average",
                    "Sum"
                ],
                correct: 2,
                explanation: "np.mean() calculates the average (mean) of values."
            }
        ]
    },
    'examples': {
        title: "🎯 Real-World Examples Quiz",
        questions: [
            {
                question: "To find the top 3 students by average score, which Pandas method would you use?",
                options: [
                    "df.sort()",
                    "df.nlargest(3, 'Average')",
                    "df.top(3)",
                    "df.max(3)"
                ],
                correct: 1,
                explanation: "nlargest(n, column) returns the n rows with the largest values in the specified column."
            },
            {
                question: "What does pct_change() calculate in sales analysis?",
                options: [
                    "Total percentage",
                    "Percentage of maximum",
                    "Percentage change from previous period",
                    "Percentage rank"
                ],
                correct: 2,
                explanation: "pct_change() calculates the percentage change between consecutive values."
            },
            {
                question: "In machine learning, what is 'training' a model?",
                options: [
                    "Teaching the model using example data",
                    "Testing the model",
                    "Debugging the model",
                    "Installing the model"
                ],
                correct: 0,
                explanation: "Training is the process of teaching a model to recognize patterns using example data."
            },
            {
                question: "What does model.score() typically return?",
                options: [
                    "The number of predictions",
                    "The accuracy of the model",
                    "The training time",
                    "The model parameters"
                ],
                correct: 1,
                explanation: "score() returns the accuracy/performance metric of the model (like R² score for regression)."
            },
            {
                question: "Why would you use groupby() in Pandas?",
                options: [
                    "To sort data",
                    "To filter data",
                    "To aggregate data by categories",
                    "To rename columns"
                ],
                correct: 2,
                explanation: "groupby() groups data by categories and allows you to perform aggregate operations on each group."
            }
        ]
    }
};

// Final Certification Quiz (before certificate)
const finalQuiz = {
    title: "🏆 Final Certification Exam",
    description: "Answer all questions to earn your certificate! Mix of multiple choice and code writing.",
    passingScore: 24, // Out of 30 (80%)
    questions: [
        // SECTION 1: Basics (Questions 1-6)
        {
            type: "multiple-choice",
            question: "What is the correct way to create a list in Python?",
            options: [
                "list = (1, 2, 3)",
                "list = [1, 2, 3]",
                "list = {1, 2, 3}",
                "list = <1, 2, 3>"
            ],
            correct: 1
        },
        {
            type: "code",
            question: "Write code to print 'Hello, World!' to the screen.",
            placeholder: "# Write your code here",
            correctAnswer: "print('Hello, World!')",
            validateAnswer: function(userCode) {
                const normalized = userCode.trim().toLowerCase().replace(/"/g, "'");
                return normalized === "print('hello, world!')" || 
                       normalized === "print(\"hello, world!\")";
            }
        },
        {
            type: "multiple-choice",
            question: "What data type is the value 42.5?",
            options: [
                "Integer (int)",
                "String (str)",
                "Float (float)",
                "Boolean (bool)"
            ],
            correct: 2
        },
        {
            type: "code",
            question: "Create a variable named 'age' and assign it the value 25.",
            placeholder: "# Create the variable",
            correctAnswer: "age = 25",
            validateAnswer: function(userCode) {
                return userCode.trim() === "age = 25" || userCode.trim() === "age=25";
            }
        },
        {
            type: "multiple-choice",
            question: "What is the result of 10 % 3?",
            options: [
                "3.33",
                "1",
                "3",
                "0"
            ],
            correct: 1
        },
        {
            type: "code",
            question: "Write code to calculate the sum of 15 and 27.",
            placeholder: "# Write your calculation",
            correctAnswer: "15 + 27",
            validateAnswer: function(userCode) {
                const cleaned = userCode.trim().replace(/\s/g, '');
                return cleaned === "15+27" || cleaned === "27+15" || 
                       cleaned.includes("print(15+27)") || cleaned.includes("print(27+15)");
            }
        },
        
        // SECTION 2: Data Structures (Questions 7-12)
        {
            type: "multiple-choice",
            question: "How do you access the first element in a list called 'numbers'?",
            options: [
                "numbers[1]",
                "numbers[0]",
                "numbers.first()",
                "numbers[-1]"
            ],
            correct: 1
        },
        {
            type: "code",
            question: "Create a list named 'fruits' containing 'apple', 'banana', and 'orange'.",
            placeholder: "# Create the list",
            correctAnswer: "fruits = ['apple', 'banana', 'orange']",
            validateAnswer: function(userCode) {
                const cleaned = userCode.trim().toLowerCase().replace(/"/g, "'").replace(/\s/g, '');
                return cleaned.includes("fruits=[") && cleaned.includes("'apple'") && 
                       cleaned.includes("'banana'") && cleaned.includes("'orange'");
            }
        },
        {
            type: "multiple-choice",
            question: "What method adds an element to the end of a list?",
            options: [
                "add()",
                "append()",
                "insert()",
                "push()"
            ],
            correct: 1
        },
        {
            type: "code",
            question: "Create a dictionary named 'student' with keys 'name' (value: 'Alice') and 'age' (value: 20).",
            placeholder: "# Create the dictionary",
            correctAnswer: "student = {'name': 'Alice', 'age': 20}",
            validateAnswer: function(userCode) {
                const cleaned = userCode.trim().toLowerCase().replace(/"/g, "'").replace(/\s/g, '');
                return cleaned.includes("student={") && cleaned.includes("'name':'alice'") && 
                       cleaned.includes("'age':20");
            }
        },
        {
            type: "multiple-choice",
            question: "What does len([1, 2, 3, 4, 5]) return?",
            options: [
                "4",
                "5",
                "6",
                "15"
            ],
            correct: 1
        },
        {
            type: "code",
            question: "Write code to get the length of a list named 'scores'.",
            placeholder: "# Get the length",
            correctAnswer: "len(scores)",
            validateAnswer: function(userCode) {
                const cleaned = userCode.trim().replace(/\s/g, '');
                return cleaned === "len(scores)" || cleaned.includes("print(len(scores))");
            }
        },
        
        // SECTION 3: Control Flow (Questions 13-18)
        {
            type: "multiple-choice",
            question: "What operator checks if two values are equal?",
            options: [
                "=",
                "==",
                "===",
                "equals()"
            ],
            correct: 1
        },
        {
            type: "code",
            question: "Write an if statement that prints 'Pass' if score is greater than or equal to 60.",
            placeholder: "# Write the if statement (assume score variable exists)",
            correctAnswer: "if score >= 60:\n    print('Pass')",
            validateAnswer: function(userCode) {
                const cleaned = userCode.trim().toLowerCase().replace(/"/g, "'");
                return cleaned.includes("if") && cleaned.includes("score") && 
                       cleaned.includes(">=") && cleaned.includes("60") && 
                       cleaned.includes("print") && cleaned.includes("pass");
            }
        },
        {
            type: "multiple-choice",
            question: "In a for loop, what does 'range(5)' create?",
            options: [
                "Numbers 1 to 5",
                "Numbers 0 to 4",
                "Numbers 0 to 5",
                "Numbers 1 to 4"
            ],
            correct: 1
        },
        {
            type: "code",
            question: "Write a for loop that prints numbers from 0 to 4 using range().",
            placeholder: "# Write the for loop",
            correctAnswer: "for i in range(5):\n    print(i)",
            validateAnswer: function(userCode) {
                const cleaned = userCode.trim().toLowerCase();
                return cleaned.includes("for") && cleaned.includes("in") && 
                       cleaned.includes("range(5)") && cleaned.includes("print");
            }
        },
        {
            type: "multiple-choice",
            question: "What does the 'break' statement do in a loop?",
            options: [
                "Pauses the loop",
                "Skips current iteration",
                "Exits the loop immediately",
                "Restarts the loop"
            ],
            correct: 2
        },
        {
            type: "code",
            question: "Write a while loop that prints numbers while count is less than 3 (assume count starts at 0).",
            placeholder: "# Write the while loop (assume count = 0 exists)",
            correctAnswer: "while count < 3:\n    print(count)\n    count += 1",
            validateAnswer: function(userCode) {
                const cleaned = userCode.trim().toLowerCase();
                return cleaned.includes("while") && cleaned.includes("count") && 
                       cleaned.includes("<") && cleaned.includes("3") && 
                       cleaned.includes("print");
            }
        },
        
        // SECTION 4: Functions (Questions 19-22)
        {
            type: "multiple-choice",
            question: "What keyword is used to define a function in Python?",
            options: [
                "function",
                "def",
                "func",
                "define"
            ],
            correct: 1
        },
        {
            type: "code",
            question: "Define a function named 'greet' that prints 'Hello!'.",
            placeholder: "# Define the function",
            correctAnswer: "def greet():\n    print('Hello!')",
            validateAnswer: function(userCode) {
                const cleaned = userCode.trim().toLowerCase().replace(/"/g, "'");
                return cleaned.includes("def") && cleaned.includes("greet") && 
                       cleaned.includes("print") && cleaned.includes("hello");
            }
        },
        {
            type: "multiple-choice",
            question: "What keyword is used to return a value from a function?",
            options: [
                "give",
                "return",
                "output",
                "send"
            ],
            correct: 1
        },
        {
            type: "code",
            question: "Write a function named 'add' that takes two parameters (a, b) and returns their sum.",
            placeholder: "# Define the function",
            correctAnswer: "def add(a, b):\n    return a + b",
            validateAnswer: function(userCode) {
                const cleaned = userCode.trim().toLowerCase().replace(/\s/g, '');
                return cleaned.includes("defadd(a,b)") && cleaned.includes("return") && 
                       cleaned.includes("a+b");
            }
        },
        
        // SECTION 5: Libraries (Questions 23-26)
        {
            type: "multiple-choice",
            question: "Which library is best for numerical computations with arrays?",
            options: [
                "Pandas",
                "Matplotlib",
                "NumPy",
                "Requests"
            ],
            correct: 2
        },
        {
            type: "code",
            question: "Write code to import NumPy with the alias 'np'.",
            placeholder: "# Import NumPy",
            correctAnswer: "import numpy as np",
            validateAnswer: function(userCode) {
                const cleaned = userCode.trim().toLowerCase().replace(/\s/g, '');
                return cleaned === "importnumpyasnp";
            }
        },
        {
            type: "multiple-choice",
            question: "In Pandas, what is a DataFrame?",
            options: [
                "A type of graph",
                "A 2D table structure",
                "A mathematical formula",
                "A file format"
            ],
            correct: 1
        },
        {
            type: "code",
            question: "Write code to import Pandas with the alias 'pd'.",
            placeholder: "# Import Pandas",
            correctAnswer: "import pandas as pd",
            validateAnswer: function(userCode) {
                const cleaned = userCode.trim().toLowerCase().replace(/\s/g, '');
                return cleaned === "importpandasaspd";
            }
        },
        
        // SECTION 6: Data Science (Questions 27-30)
        {
            type: "multiple-choice",
            question: "Which library is used for creating data visualizations?",
            options: [
                "NumPy",
                "Pandas",
                "Matplotlib",
                "SciPy"
            ],
            correct: 2
        },
        {
            type: "code",
            question: "Write code to calculate the average of a list: [10, 20, 30, 40, 50] using sum() and len().",
            placeholder: "# Calculate average",
            correctAnswer: "sum([10, 20, 30, 40, 50]) / len([10, 20, 30, 40, 50])",
            validateAnswer: function(userCode) {
                const cleaned = userCode.trim().replace(/\s/g, '');
                return (cleaned.includes("sum") && cleaned.includes("len") && 
                        cleaned.includes("[10,20,30,40,50]")) ||
                       cleaned.includes("150/5") || cleaned.includes("30");
            }
        },
        {
            type: "multiple-choice",
            question: "Which statement is true about Python indentation?",
            options: [
                "It's optional for style",
                "It's required and defines code blocks",
                "Only spaces work",
                "Only tabs work"
            ],
            correct: 1
        },
        {
            type: "code",
            question: "Write code to create a variable 'result' that stores the value of 2 raised to the power of 3.",
            placeholder: "# Calculate 2^3",
            correctAnswer: "result = 2 ** 3",
            validateAnswer: function(userCode) {
                const cleaned = userCode.trim().replace(/\s/g, '');
                return cleaned === "result=2**3" || cleaned === "result=2*2*2" || 
                       cleaned === "result=8";
            }
        }
    ]
};

