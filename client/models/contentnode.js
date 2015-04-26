/**
 * Created by ysahn on 4/7/15.
 */
var Model = require('ampersand-model');
var Collection = require('ampersand-rest-collection');

var internals = {};

internals.ContentNode = Model.extend({
    idAttribute: 'uuid',
    props: {
        uuid: { type: 'string', required: true },
        refName: { type: 'string', required: true }, // Reference Name of this content
        parent: { type: 'string' },
        parentUuid: { type: 'string' },
        index: { type: 'number' }, // Index within it's parent

        createdBy: { type: 'string' },
        createdAt: { type: 'date' },
        modifiedBy: { type: 'string' },
        modifiedAt: { type: 'date' },
        copiedFrom: { type: 'string' },
        kind: { type: 'string', required: true }, // <CourseTemplate|Assignment>,
        metadata: {
            // The area in which the learner is engaged",
            learningArea: {
                subject:     { type: 'string', required: true }, // "Match"
                subjectArea: { type: 'string', required: true }, // "Arithmetic"
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
            isAssessment: { type: Boolean }
        },

        body: {
            // The models section includes data passed to"
            items: { type: 'array'}
        }
    }
});

internals.ContentNodeCollection = Collection.extend({
    model: internals.ContentNode
});

internals.createContentNode = function(urlRoot, uuid)
{
    var model = new internals.ContentNode({uuid: uuid});
    model.urlRoot = urlRoot;
    return model;
}

internals.createContentNodeCollection = function(url)
{
    var collection = new internals.ContentNodeCollection();
    collection.url = url;
    return collection;
}


module.exports.ContentNode = internals.ContentNode;
module.exports.createContentNode = internals.createContentNode;
module.exports.createContentNodeCollection = internals.createContentNodeCollection;
