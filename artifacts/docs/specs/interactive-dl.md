EcoLearnia Interactive Description Language (ELIDS)




Sample:

    "models": {
        "question": {
            "prompt": "What are possible answer for square root of 4?",
            "fields": [
                {
                    "id": "field1",
                    "type": "number",
                    "options": [
                        {
                            "key": "2",
                            "value": "Two"
                        },
                        {
                            "key": "3",
                            "value": "Three"
                        },
                        {
                            "key": "4",
                            "value": "Four"
                        },
                        {
                            "key": "-2",
                            "value": "Minus Four"
                        }
                    ]
                },
                {
                    "id": "field2",
                    "type": "number",
                    "options": [
                        {
                            "key": "2",
                            "value": "Two"
                        },
                        {
                            "key": "4",
                            "value": "Four"
                        },
                        {
                            "key": "-2",
                            "value": "Minus Four"
                        }
                    ]
                }
            ],
            
            "!doc": "Optional, when student already submited is available",
            "submissions": [
                {
                    "timestamp": ISODATE,
                    "timeSpent": seconds,
                    "score": <number>,
                    "fields": [
                        { fieldId: 0, "answeredKey": "2", "answeredValue": "Two", correctness: 1,  },
                        { fieldId: 1, "answeredKey": "-2", "answeredValue": "Minus Two", correctness: 1 }
                    ]
                }
            ]
        }
    },
    "components": [
        {
            "id": "my_question",
            "type": "TemplateContainer",
            "config": {
                "template": "<div>{{.models.question.prompt}}<br /> {{.components.mvquestion}} <br/> ${actionbar} <br/> ${feedback}</div>",
                "~doc": "Optionally:"
            }
        },
        {
            "id": "mvquestion",
            "type": "MultiValueQuestion",
            "config": {
                "question": { "_lref" : ".models.question"},
                "presentation": "multiselect"
            }
        },
        {
            "id": "actionbar",
            "type": "ActionBar",
            "config": {
                "items": [
                    "audio","submission","reset","read","hint"
                ]
            }
        },
        {
            "id": "feedback",
            "type": "Feedback",
            "config": {
                "display": "list"
            }
        }
    ],
    "actions": {
        "solution": "4 + 4 + 1 = 9",
        "!doc": "hints is an array in the order that is shown per attemp failure",
        "hints": [
            "How can 5 be decomposed?"
        ]
    },
    "processFlow": {
        "beforeRender": {

        },
        "afterSumission": {

        }
    },
    "policy": {
        "maxAttempts": 10,
        "!doc": "Optional - if present, each attempt will be timed in seconds",
        "timed": 10,
        "timeOverAction": "action to take when time is over"
    },
    "submissionEval": {
        "engine": "ArithmeticExpression",
        "correctAnswer": {
            "sum": "9"
        },
        "responses": {
            "attemptFeedbacks": [
                {
                    "case": "$sum $gt $9",
                    "message": "Number too large"
                },
                {
                    "case": "$sum $lt $9",
                    "message": "Your answer $sum is too small"
                }
            ],
            "timeoutFeedback": "Sorry, timed out",
            "pastDueDateFeedback": "Due date passed."
        }
    }