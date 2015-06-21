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
 *  This file includes definition of ContentService proxy class.
 *
 * @author Young Suk Ahn Park
 * @date 4/7/15
 */
var promiseutils = require('../common/promiseutils');
var contentnodemodel = require('../models/contentnode');
var contentitemmodel = require('../models/contentitem');

/** Declaration of internal namespace */
var internals = {};

/**
 *
 * @param config
 * @constructor
 */
internals.ContentService = function(config)
{
    this.rootUrl = config.rootUrl;

};

/**
 * createNode
 *
 * Creates a node and its descendants
 *
 * @param parentUuid - parent UUID
 * @returns {ContentNodeMode}
 */
internals.ContentService.prototype.createNode = function(parentUuid) {
    var newNode = contentnodemodel.createContentNode(this.rootUrl + '/nodes');
    newNode.set({parentUuid: parentUuid});
    return newNode;
};

/**
 * queryNodes
 *
 * Retrieves content nodes
 *
 * @param criteria
 * @returns {Promise}
 */
internals.ContentService.prototype.queryNodes = function(criteria)
{
    var promise = promiseutils.createPromise( function(resolve, reject) {

        var contentNodes = contentnodemodel.createContentNodeCollection(this.rootUrl + '/nodes');

        function successCallback(collection, response, options) {
            resolve(collection);
        }

        function errorCallback(collection, response, options) {
            if (response.body)
            {
                reject(response);
            } else {
                var error = new Error('Communication error');
                reject(error);
            }
        }

        contentNodes.fetch({
            //data: {page: 3},
            success: successCallback,
            error: errorCallback
        });

    }.bind(this));

    return promise;
};

/**
 * fetchNode
 *
 * Fetches a node and its descendants
 *
 * @param uuid
 * @returns {Promise}
 */
internals.ContentService.prototype.fetchNode = function(uuid)
{

    var promise = promiseutils.createPromise( function(resolve, reject) {

        var contentNode = contentnodemodel.createContentNode(this.rootUrl + '/nodes', uuid);

        function successCallback(model, response, options)
        {
            resolve(model);
        }

        function errorCallback(model, response, options)
        {
            if (response.body)
            {
                reject(response);
            } else {
                var error = new Error('Communication error');
                reject(error);
            }
        }

        contentNode.fetch({
            success: successCallback,
            error: errorCallback
        });

    }.bind(this));

    return promise;
};

/**
 * deleteNode
 *
 * Deletes a node and its descendants
 *
 * @param uuid
 * @returns {Promise}
 */
internals.ContentService.prototype.deleteNode = function(uuid)
{

    var promise = promiseutils.createPromise( function(resolve, reject) {

        var contentNode = contentnodemodel.createContentNode(this.rootUrl + '/nodes', uuid);

        function successCallback(model, response, options)
        {
            resolve(model);
        }

        function errorCallback(model, response, options)
        {
            if (response.body)
            {
                reject(response);
            } else {
                var error = new Error('Communication error');
                reject(error);
            }
        }

        contentNode.destroy({
            success: successCallback,
            error: errorCallback
        });

    }.bind(this));

    return promise;
};

/**
 * createItem
 *
 * Creates an item
 *
 * @param parentUuid - parent UUID
 * @returns {ContentItemModel}
 */
internals.ContentService.prototype.createItem = function(parentUuid) {
    var baseUrl = this.getItemBaseUrl(parentUuid);
    var newItem = contentitemmodel.createContentItem(baseUrl);
    var metadata = {
        "title": "My test",
            "preRecommendations": [],
            "authors": [],
            "version": "0.0.1",
            "learningArea": {
            "subject": "math",
                "subjectArea": "arithmetic",
                "tags": [
                "1G"
            ],
                "topicHierarchy": [
                "addition",
                "addition-2digits"
            ]
        }
    };
    // @todo - Body part assigned from re-defined template
    var body = {
        "definition": {
            "question": {
            "prompt": "Your question prompt",
                "fields": [
                    {
                        "id": "field1",
                        "type": "number",
                        "required": true,
                        "options": [
                            {
                                "key": "2",
                                "value": "2"
                            }

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
                    "template": "<div>{{.definition.greet}}<br /> {{.components.selectquestion}} <br/> {{.components.actionbar}} <br/> {{.components.feedback}}</div>",
                    "~doc": "Optionally:"
                }
            },
            {
                "id": "selectquestion",
                "type": "SelectQuestion",
                "config": {
                    "question": { "_lref" : ".definition.question"},
                    "layout": "flow"
                }
            },
            {
                "id": "actionbar",
                "type": "ActionBar",
                "config": {
                    "items": [
                        "tts","submit","reset","hint"
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
        "evalRule": {
            "fieldRules": {
                "field1": {
                    "engine": "regex",
                        "pattern": "(2|\\-2)"
                }
            },
            "responses": [
                {
                    "case": { "condition": "incorrect", "field": "field1"},
                    "feedback": {
                        "field": "field1",
                        "message":"Incorrect"
                    }
                },
                {
                    "case": "$field1 > 2",
                    "feedback": {
                        "field": "field1",
                        "message": "Number too large"
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
                    "case": "__past_due__",
                    "feedback": {
                        "field": "__aggregate__",
                        "message": "Due date passed"
                    }
                }
            ]
        }
    };
    newItem.set({
        parentUuid: parentUuid,
        metadata: metadata,
        body: body
    });
    return newItem;
};

/**
 * queryItems
 *
 * Retrieves content items
 *
 * @param {Object} criteria
 * @param {!string} parentNodeUuid
 *
 * @return {Promise}
 */
internals.ContentService.prototype.queryItems = function(criteria, parentNodeUuid)
{
    var promise = promiseutils.createPromise( function(resolve, reject) {

        var baseUrl = this.getItemBaseUrl(parentNodeUuid);

        var contentItem = contentitemmodel.createContentItemCollection(baseUrl);

        function successCallback(collection, response, options) {
            resolve(collection);
        }

        function errorCallback(collection, response, options) {
            if (response.body)
            {
                reject(response);
            } else {
                var error = new Error('Communication error');
                reject(error);
            }
        }

        contentItem.fetch({
            success: successCallback,
            error: errorCallback
        });

    }.bind(this));

    return promise;
};

/**
 * fetchItem
 *
 * Retrieves a single content item
 *
 * @param {string} uuid
 * @param {!string} parentNodeUuid
 *
 * @return {Promise}
 */
internals.ContentService.prototype.fetchItem = function(uuid, parentNodeUuid)
{
    var promise = promiseutils.createPromise( function(resolve, reject) {

        var baseUrl = this.getItemBaseUrl(parentNodeUuid);
        var contentItem = contentitemmodel.createContentItem(baseUrl, uuid);

        function successCallback(model, response, options)
        {
            resolve(model);
        }

        function errorCallback(model, response, options)
        {
            if (response.body)
            {
                reject(response);
            } else {
                var error = new Error('Communication error');
                reject(error);
            }
        }

        contentItem.fetch({
            success: successCallback,
            error: errorCallback
        });

    }.bind(this));

    return promise;
};


/**
 * deleteItem
 *
 * Removes an item
 *
 * @param {string} uuid
 * @param {!string} parentNodeUuid
 * @returns {Promise}
 */
internals.ContentService.prototype.deleteItem = function(uuid, parentNodeUuid)
{

    var promise = promiseutils.createPromise( function(resolve, reject) {

        var baseUrl = this.getItemBaseUrl(parentNodeUuid);
        var contentItem = contentitemmodel.createContentItem(baseUrl, uuid);

        function successCallback(model, response, options)
        {
            resolve(model);
        }

        function errorCallback(model, response, options)
        {
            if (response.body)
            {
                reject(response);
            } else {
                var error = new Error('Communication error');
                reject(error);
            }
        }

        contentItem.destroy({
            success: successCallback,
            error: errorCallback
        });

    }.bind(this));

    return promise;
};

internals.ContentService.prototype.getItemBaseUrl = function(parentNodeUuid) {
    var baseUrl;
    if (parentNodeUuid) {
        baseUrl = this.rootUrl + '/nodes/' + parentNodeUuid + '/items';
    } else {
        baseUrl = this.rootUrl + '/contentitems';
    }
    return baseUrl;
}

module.exports.ContentService = internals.ContentService;
