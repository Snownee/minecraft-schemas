import { CollectionRegistry, SchemaRegistry } from '@mcschema/core'
import { initAdvancementSchemas } from './Advancement'
import { initAssetsSchemas } from './assets'
import { initChatTypeSchemas } from './ChatType'
import { initCommonSchemas } from './Common'
import { initConditionSchemas } from './Condition'
import { initDimensionSchemas } from './Dimension'
import { initDimensionTypeSchemas } from './DimensionType'
import { initItemModifierSchemas } from './ItemModifier'
import { initLootTableSchemas } from './LootTable'
import { initPackMcmetaSchemas } from './PackMcmeta'
import { initPredicatesSchemas } from './Predicates'
import { initRecipeSchemas } from './Recipe'
import { initTagsSchemas } from './Tags'
import { initTextComponentSchemas } from './TextComponent'
import { initWorldgenSchemas } from './worldgen'
import { initWorldSettingsSchemas } from './WorldSettings'
import {initLycheeCommonSchemas} from "./LycheeCommon";
import {initContextualConditionsSchemas} from "./ContextualCondition";
import {initLycheeRecipeSchemas} from "./LycheeRecipe";
import {initPostActionsSchemas} from "./PostAction";
import {initLoquatSchemas} from "./Loquat";

export function initSchemas(schemas: SchemaRegistry, collections: CollectionRegistry) {
    // `Common.ts` is the only file that has exports. It should be initialized first. 
    initCommonSchemas(schemas, collections)
    initChatTypeSchemas(schemas, collections)
    initAdvancementSchemas(schemas, collections)
    initAssetsSchemas(schemas, collections)
    initConditionSchemas(schemas, collections)
    initDimensionTypeSchemas(schemas, collections)
    initDimensionSchemas(schemas, collections)
    initItemModifierSchemas(schemas, collections)
    initLootTableSchemas(schemas, collections)
    initPackMcmetaSchemas(schemas, collections)
    initPredicatesSchemas(schemas, collections)
    initRecipeSchemas(schemas, collections)
    initTagsSchemas(schemas, collections)
    initTextComponentSchemas(schemas, collections)
    initWorldgenSchemas(schemas, collections)
    initWorldSettingsSchemas(schemas, collections)

    initLycheeCommonSchemas(schemas, collections)
    initContextualConditionsSchemas(schemas, collections)
    initPostActionsSchemas(schemas, collections)
    initLycheeRecipeSchemas(schemas, collections)
    initLoquatSchemas(schemas, collections)
}
