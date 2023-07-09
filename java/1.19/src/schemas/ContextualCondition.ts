import {
    CollectionRegistry,
    SchemaRegistry,
    Reference as RawReference,
    StringNode as RawStringNode,
    Mod,
    ObjectNode, Switch, Case, NumberNode, ListNode, Opt, BooleanNode, ChoiceNode,
} from "@mcschema/core"

export function initContextualConditionsSchemas(schemas: SchemaRegistry, collections: CollectionRegistry) {
    const Reference = RawReference.bind(undefined, schemas)
    const StringNode = RawStringNode.bind(undefined, collections)

    schemas.register('contextual_condition', Mod(ObjectNode({
        type: StringNode({enum: 'contextual_condition_type'}),
        secret: Opt(BooleanNode()),
        description: Opt(StringNode()),
        [Switch]: [{push: 'type'}],
        [Case]: {
            'chance': {
                chance: NumberNode({min: 0, max: 1})
            },
            'not': {
                contextual: Reference('contextual_condition')
            },
            'or': {
                contextual: ListNode(Reference('contextual_condition'), /*{minLength: 2}*/)
            },
            'and': {
                contextual: ListNode(Reference('contextual_condition'), /*{minLength: 2}*/)
            },
            'location': {
                offsetX: Opt(NumberNode({integer: true})),
                offsetY: Opt(NumberNode({integer: true})),
                offsetZ: Opt(NumberNode({integer: true})),
                predicate: Reference('location_predicate')
            },
            'weather': {
                weather: StringNode({enum: ['clear', 'rain', 'thunder']})
            },
            'difficulty': {
                difficulty: ChoiceNode([
                    {
                        type: 'string',
                        node: Reference('difficulty'),
                    },
                    {
                        type: 'list',
                        node: ListNode(Reference('difficulty')),
                    }
                ])
            },
            'time': {
                value: Reference('int_bounds'),
                period: Opt(NumberNode({integer: true})),
            },
            'execute': {
                command: StringNode({validator: 'command', params: {}}),
                value: Opt(Reference('int_bounds')),
            },
            'fall_distance': {
                range: Reference('float_bounds')
            },
            'entity_health': {
                range: Reference('float_bounds')
            },
            'direction': {
                direction: StringNode({enum: ['up', 'down', 'north', 'south', 'east', 'west', 'side', 'forward']})
            },
            'is_sneaking': {},
            'check_param': {
                key: StringNode(),
            }
        }
    }, { context: 'contextual_condition' }), {
        default: () => ({
            type: 'chance'
        })
    }))
}