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
 *  This file includes the definition of EliReactComponentMixin mixin.
 *  NOTE: Prefer use of class inheritance over mixin.
 *  @see elireactcomponent.js
 *
 * @author Young Suk Ahn Park
 * @date 5/15/15
 */

/**
 * Mixin for ELI Components based on React
 *
 */
var EliReactComponentMixin = {
    componentType: function()
    {
        return 'react';
    }
};

module.exports.EliReactComponentMixin = EliReactComponentMixin;