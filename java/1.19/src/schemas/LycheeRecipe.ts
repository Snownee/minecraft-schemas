import {
    Case,
    ChoiceNode,
    StringNode as RawStringNode,
    ListNode,
    MapNode,
    Mod,
    NumberNode,
    ObjectNode,
    Reference as RawReference,
    Switch,
    SchemaRegistry,
    CollectionRegistry,
    Opt, BooleanNode,
} from '@mcschema/core'

export function initLycheeRecipeSchemas(schemas: SchemaRegistry, collections: CollectionRegistry) {
    const Reference = RawReference.bind(undefined, schemas)
    const StringNode = RawStringNode.bind(undefined, collections)

    schemas.register('lychee_recipe', Mod(ObjectNode({
        type: StringNode({enum: 'lychee_recipe_serializer'}),
        comment: Opt(StringNode()),
        ghost: Opt(BooleanNode()),
        hide_in_viewer: Opt(BooleanNode()),
        contextual: Opt(ListNode(Reference('contextual_condition'))),
        post: Opt(ListNode(Reference('post_action'))),
        [Switch]: [{push: 'type'}],
        [Case]: {
            'lychee:block_interacting': {
                group: Opt(StringNode()),
                max_repeats: Opt(NumberNode({integer: true, min: 1})),
                item_in: ChoiceNode([
                    {
                        type: 'object',
                        node: Reference('recipe_ingredient'),
                        change: v => v[0]
                    },
                    {
                        type: 'list',
                        node: ListNode(Reference('recipe_ingredient'), {minLength: 2, maxLength: 2}),
                        change: v => [v]
                    }
                ]),
                block_in: Reference('lychee_block_predicate'),
            },
            'lychee:block_clicking': {
                group: Opt(StringNode()),
                max_repeats: Opt(NumberNode({integer: true, min: 1})),
                item_in: ChoiceNode([
                    {
                        type: 'object',
                        node: Reference('recipe_ingredient'),
                        change: v => v[0]
                    },
                    {
                        type: 'list',
                        node: ListNode(Reference('recipe_ingredient'), {minLength: 2, maxLength: 2}),
                        change: v => [v]
                    }
                ]),
                block_in: Reference('lychee_block_predicate'),
            },
            'lychee:item_burning': {
                group: Opt(StringNode()),
                max_repeats: Opt(NumberNode({integer: true, min: 1})),
                item_in: Reference('recipe_ingredient'),
            },
            'lychee:item_inside': {
                group: Opt(StringNode()),
                max_repeats: Opt(NumberNode({integer: true, min: 1})),
                item_in: ListNode(Reference('recipe_ingredient')),
                block_in: Reference('lychee_block_predicate'),
                time: Opt(NumberNode({integer: true})),
            },
            'lychee:anvil_crafting': {
                item_in: ChoiceNode([
                    {
                        type: 'object',
                        node: Reference('recipe_ingredient'),
                        change: v => v[0]
                    },
                    {
                        type: 'list',
                        node: ListNode(Reference('recipe_ingredient'), {minLength: 2, maxLength: 2}),
                        change: v => [v]
                    }
                ]),
                item_out: Reference('recipe_result'),
                level_cost: Opt(NumberNode({integer: true, min: 1})),
                material_cost: Opt(NumberNode({integer: true})),
                assembling: Opt(ListNode(Reference('post_action'))),
            },
            'lychee:block_crushing': {
                group: Opt(StringNode()),
                max_repeats: Opt(NumberNode({integer: true, min: 1})),
                item_in: Opt(ListNode(Reference('recipe_ingredient'))),
                falling_block: Opt(Reference('lychee_block_predicate')),
                landing_block: Opt(Reference('lychee_block_predicate')),
            },
            'lychee:lightning_channeling': {
                group: Opt(StringNode()),
                max_repeats: Opt(NumberNode({integer: true, min: 1})),
                item_in: Opt(ListNode(Reference('recipe_ingredient'))),
            },
            'lychee:item_exploding': {
                group: Opt(StringNode()),
                max_repeats: Opt(NumberNode({integer: true, min: 1})),
                item_in: Opt(ListNode(Reference('recipe_ingredient'))),
            },
            'lychee:block_exploding': {
                group: Opt(StringNode()),
                block_in: Opt(Reference('lychee_block_predicate')),
            },
            'lychee:random_block_ticking': {
                group: Opt(StringNode()),
                block_in: Reference('lychee_block_predicate'),
            },
            'lychee:dripstone_dripping': {
                group: Opt(StringNode()),
                source_block: Reference('lychee_block_predicate'),
                target_block: Reference('lychee_block_predicate'),
            },
            'lychee:crafting': {
                group: Opt(StringNode({enum: 'recipe_group', additional: true})),
                pattern: ListNode(StringNode()), // TODO: add validation
                key: MapNode(
                    StringNode(), // TODO: add validation
                    Reference('recipe_ingredient')
                ),
                result: Reference('recipe_result'),
                assembling: Opt(ListNode(Reference('post_action'))),
            }
        },
    }, {context: 'recipe', disableSwitchContext: true}), {
        default: () => ({
            type: 'lychee:block_interacting'
        })
    }))
}
