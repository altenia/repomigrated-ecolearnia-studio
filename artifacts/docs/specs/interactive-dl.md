EcoLearnia Interactive Description Language (ELIDS)




Sample:

    {
        "definition": {
            "question": {
                "prompt": "What are the possible answers for square root of 4?",
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
                        "score": 1,
                        "fields": [
                            { 
                                "fieldId": 0, 
                                "answeredKey": "2", 
                                "answeredValue": "Two", 
                                "score": 1, 
                                "feedback": 'Great' 
                            },
                            { "fieldId": 1, "answeredKey": "-2", "answeredValue": "Minus Two", score: 1 }
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
                    "template": "<div>{{.models.question.prompt}}<br /> {{.components.selectquestion}} <br/> ${actionbar} <br/> ${feedback}</div>",
                    "~doc": "Optionally:"
                }
            },
            {
                "id": "selectquestion",
                "type": "SelectQuestion",
                "config": {
                    "question": { "_lref" : ".models.question"},
                    "layout": "flow"
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
            "solution": "2 * 2 = 4; also -2 * -2 = 4",
            "!doc": "hints is an array in the order that is shown per attemp failure",
            "hints": [
                "What multiplied twice gives 4?",
                "Remember that multiplying two negatives yields positive."
            ]
        },
        "processFlow": {
            "beforeRender": {
    
            },
            "afterSumission": {
    
            }
        },
        "policy": {
            "maxAttempts": 3,
            "!doc": "Optional - if present, each attempt will be timed in seconds",
            "timed": 10,
            "timeOverAction": "action to take when time is over"
        },
        "eval": {
            "correctAnswer": {
                "field1": {"regex": "2"},
                "field2": {"expression": "$field2 * $field2 == 4"}
            },
            "responses": [
                {
                    "case": { "condition": "incorrect", "field": "field1"},
                    "feedback": {
                        "field": "field1",
                        "Incorrect"
                    }
                },
                {
                    "case": { "condition": "incorrect", "field": "field2"},
                    "feedback": {
                        "field": "field2",
                        "Incorrect"
                    }
                },
                {
                    "case": "$field1 > 2",
                    "feedback": {
                        "field": "field1",
                        "Number too large"
                    }
                },
                {
                    "case": "$field1 == $field2",
                    "feedback": {
                        "field": "__aggregate__",
                        "message": "Fields cannot be same"
                    }
                },
                {
                    "case": "__timeout__",
                    "feedback": {
                        "field": "__aggregate__",
                        "message": "Sorry, timed out"
                    }
                },
                {
                    "case": "__past_duedate__",
                    "feedback": {
                        "field": "__aggregate__",
                        "message": "Due date passed"
                    }
                }
            ]
        }
    }