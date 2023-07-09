import {
    BooleanNode,
    Case, ChoiceNode,
    CollectionRegistry,
    FilteredChildren,
    ListNode, MapNode,
    Mod,
    NestedNodeChildren,
    NumberNode,
    ObjectNode,
    Opt,
    Reference as RawReference,
    SchemaRegistry,
    StringNode as RawStringNode,
    Switch,
} from "@mcschema/core"

export function createPostActionFields(schemas: SchemaRegistry, collections: CollectionRegistry, insideRandom: boolean): FilteredChildren {
    const Reference = RawReference.bind(undefined, schemas)
    const StringNode = RawStringNode.bind(undefined, collections)
    const RandomCase: NestedNodeChildren = insideRandom ? {} : {
        'random': {
            rolls: Opt(Reference('int_bounds')),
            entries: ListNode(ObjectNode(createPostActionFields(schemas, collections, true))),
            empty_weight: Opt(NumberNode({integer: true})),
        }
    }
    let fields: FilteredChildren = {
        type: StringNode({enum: 'post_action_type'}),
        contextual: Opt(ListNode(Reference('contextual_condition'))),
        [Switch]: [{push: 'type'}],
        [Case]: {
            ...RandomCase,
            'drop_item': {
                item: StringNode({validator: 'resource', params: {pool: 'item', allowUnknown: true}}),
                count: Opt(Mod(NumberNode({integer: true}), {default: () => 1})),
            },
            'place': {
                block: Reference('lychee_block_predicate'),
                offsetX: Opt(NumberNode({integer: true})),
                offsetY: Opt(NumberNode({integer: true})),
                offsetZ: Opt(NumberNode({integer: true})),
            },
            'execute': {
                command: StringNode({validator: 'command', params: {}}),
                hide: Opt(BooleanNode()),
            },
            'drop_xp': {
                xp: NumberNode({integer: true}),
            },
            'if': {
                then: Opt(ListNode(Reference('post_action'))),
                else: Opt(ListNode(Reference('post_action'))),
            },
            'explode': {
                offsetX: Opt(NumberNode({integer: true})),
                offsetY: Opt(NumberNode({integer: true})),
                offsetZ: Opt(NumberNode({integer: true})),
                fire: Opt(BooleanNode()),
                block_interaction: Opt(StringNode({enum: ['none', 'break', 'destroy']})),
                radius: Opt(NumberNode()),
                radius_step: Opt(NumberNode()),
            },
            'hurt': {
                damage: Reference('float_bounds'),
                source: Opt(StringNode({enum: ['generic', 'magic', 'out_of_world', 'anvil', 'wither', 'freeze', 'drown', 'fall', 'in_fire', 'on_fire', 'lava']})),
            },
            'anvil_damage_chance': {
                chance: NumberNode({min: 0, max: 1}),
            },
            'add_item_cooldown': {
                s: NumberNode(),
            },
            'move_towards_face': {
                factor: NumberNode(),
            },
            'delay': {
                s: NumberNode(),
            },
            'break': {},
            'cycle_state_property': {
                block: Reference('lychee_block_predicate'),
                property: StringNode(),
                offsetX: Opt(NumberNode({integer: true})),
                offsetY: Opt(NumberNode({integer: true})),
                offsetZ: Opt(NumberNode({integer: true})),
            },
            'prevent_default': {},
            'damage_item': {
                damage: Opt(Mod(NumberNode({integer: true}), {default: () => 1})),
                target: Opt(Reference('json_pointer')),
            },
            'set_item': {
                target: Opt(Reference('json_pointer')),
                item: StringNode({validator: 'resource', params: {pool: 'item', allowUnknown: true}}),
                count: Opt(Mod(NumberNode({integer: true}), {default: () => 1})),
            },
            // 'nbt_patch': {
            //     op: StringNode({enum: ['add', 'remove', 'replace', 'copy', 'move', 'test', 'merge', 'deep_merge']}),
            //     path: Reference('json_pointer'),
            //     source: Opt(Reference('json_pointer')),
            //     value: Opt(Reference('nbt')),
            // },
            'loquat:spawn': {
                count: Opt(NumberNode({integer: true})),
                mob: Mod(ChoiceNode([
                    {
                        type: 'string',
                        node: StringNode({validator: 'resource', params: {pool: 'entity_type', allowUnknown: true}})
                    },
                    {
                        type: 'object',
                        node: ObjectNode({
                            type: StringNode({
                                validator: 'resource',
                                params: {pool: 'entity_type', allowUnknown: true}
                            }),
                            randomize: Opt(BooleanNode()),
                            attrs: Opt(MapNode(StringNode({
                                enum: [
                                    'hp',
                                    'movement_speed',
                                    'damage',
                                    'attack_speed',
                                    'armor',
                                    'armor_toughness',
                                    'knockback_resistance',
                                    'knockback'
                                ], additional: true
                            }), NumberNode()))
                        })
                    }
                ]), {default: () => "minecraft:zombie"}),
                zone: Opt(StringNode()),
            }
        }
    }
    if (insideRandom) {
        fields['weight'] = Opt(NumberNode({integer: true, min: 1}))
    }
    return fields
}

export function initPostActionsSchemas(schemas: SchemaRegistry, collections: CollectionRegistry) {
    schemas.register('post_action', Mod(ObjectNode(createPostActionFields(schemas, collections, false), {context: 'post_action'}), {
        default: () => ({
            type: 'drop_item'
        })
    }))
}
