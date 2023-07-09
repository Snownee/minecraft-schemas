import {
    CollectionRegistry,
    ListNode,
    NumberNode,
    ObjectNode,
    Opt,
    Reference as RawReference,
    SchemaRegistry,
    StringNode as RawStringNode
} from "@mcschema/core";

export function initLoquatSchemas(schemas: SchemaRegistry, collections: CollectionRegistry) {
    const Reference = RawReference.bind(undefined, schemas)
    const StringNode = RawStringNode.bind(undefined, collections)

    schemas.register('loquat_spawner', ObjectNode({
        waves: ListNode(ObjectNode({
            wait: Opt(NumberNode({integer: true})),
            timeout: Opt(NumberNode({integer: true})),
            contextual: Opt(ListNode(Reference('contextual_condition'))),
            post: Opt(ListNode(Reference('post_action'))),
        })),
        difficulty: StringNode(),
    }, {context: 'loquat_spawner'}))
}