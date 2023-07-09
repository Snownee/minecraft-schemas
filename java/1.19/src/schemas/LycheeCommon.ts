import {
    ChoiceNode,
    CollectionRegistry,
    Mod,
    Reference as RawReference,
    SchemaRegistry,
    StringNode as RawStringNode
} from "@mcschema/core";

export function initLycheeCommonSchemas(schemas: SchemaRegistry, collections: CollectionRegistry) {
    const Reference = RawReference.bind(undefined, schemas)
    const StringNode = RawStringNode.bind(undefined, collections)

    schemas.register('lychee_block_predicate', Mod(ChoiceNode([
            {
                type: 'string',
                node: StringNode(),
            },
            {
                type: 'object',
                node: Reference('block_predicate'),
            }
        ]), {
            default: () => "*"
        }
    ))

    schemas.register('json_pointer', Mod(StringNode(), {
        default: () => "/"
    }))

    schemas.register('difficulty', StringNode({enum: ['peaceful', 'easy', 'normal', 'hard']}))
}