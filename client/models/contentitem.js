/*
 * This file is part of the EcoLearnia platform.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * EcoLearnia v0.0.1
 *
 * @fileoverview
 *  This file includes definition of ContentItem model.
 *
 * @author Young Suk Ahn Park
 * @date 4/27/15
 */
var Model = require('ampersand-model');
var Collection = require('ampersand-rest-collection');

var internals = {};

internals.ContentItem = Model.extend({
    idAttribute: 'uuid',
    props: {
        realmUuid: { type: 'string', required: false }, // @todo turn this to requried
        uuid: { type: 'string', required: true },
        refName: { type: 'string', required: true }, // Reference Name of this content
        parent: { type: 'string' },
        parentUuid: { type: 'string' },
        ordering: { type: 'number' }, // Index within it's parent

        createdBy: { type: 'string' },
        createdAt: { type: 'date' },
        modifiedBy: { type: 'string' },
        modifiedAt: { type: 'date' },
        copiedFrom: { type: 'string' },
        kind: { type: 'string', required: true }, // <CourseTemplate|Assignment>,
        metadata: {
            // The area in which the learner is engaged,
            // If the values are not provided, it inherits from parent
            learningArea: {
                subject:     { type: 'string', required: true }, // "Match"
                subjectArea: { type: 'string', required: true }, // "Arithmetic"
                domainCodeSource: { type: 'string', required: false }, // "CommonCore",
                domainCode: { type: 'string', required: false }, // "arithmetic",
                // Array of the topic hierarchy starting from the broadest to  specific",
                // Without including the subject and subjectArea",
                topicHierarchy: { type: 'array'},
                tags: { type: 'array'}
            },

            // If this content was originally copied from another content",
            copiedFrom: { type: 'string' }, // The GUID
            createdAt:  { type: 'date' },
            modifiedAt: { type: 'date' },
            version:    { type: 'string', default: '0.0.1' },
            authors:    { type: 'array'},
            license:    'string', // "Creative Commons",
            locale:     { type: 'string' }, // "en_US",
            title:      { type: 'string', required: true}, // "Sum of Single Digit",
            description:{ type: 'string' }, // "Sum of Single Digit",
            // ? How the pre recomendation should be encoded? by GUID?",
            preRecommendations: { type: 'array'},
            isAssessment: { type: 'boolean' }
        },

        body: {
            // The models section includes data passed to"
            models: {type: 'object'},

            // The presenters sections includes configuration information",
            // for the UI components ",
            components: { type: 'array'},

            actions: { type: 'object'},

            processFlow: {type: 'object'},

            // The models section includes data passed to",
            policy: {
                maxAttempts: { type: 'number'},
                // Optional - if present, each attempt will be timed in seconds",
                timed: { type: 'number'},
                timeOverAction: { type: 'string'}
            },

            // The models section includes data passed to",
            submissionEval: {
                engine: {type: 'string'},
                correctAnswer: {type: 'object'},
                // The models section includes data passed to",
                responses: {
                    attemptFeedbacks: [
                        {
                            case: {type: 'object'}, // Expression
                            message: {type: 'string'} // feedback message
                        }
                    ],
                    timeoutFeedback: {type: 'string'},
                    pastDueDateFeedback: {type: 'string'},
                    solution: {type: 'object'},
                    hints: {type: 'array'}
                }
            }
        }
    }
});

internals.ContentItemCollection = Collection.extend({
    model: internals.ContentItem
});

internals.createContentItem = function(urlRoot, uuid)
{
    var model = new internals.ContentItem({uuid: uuid});
    model.urlRoot = urlRoot;
    return model;
};

internals.createContentItemCollection = function(url)
{
    var collection = new internals.ContentItemCollection();
    collection.url = url;
    return collection;
};


module.exports.ContentItem = internals.ContentItem;
module.exports.createContentItem = internals.createContentItem;
module.exports.createContentItemCollection = internals.createContentItemCollection;
