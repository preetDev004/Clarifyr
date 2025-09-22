from loguru import logger
from qdrant_client import models as qdrant_models

from utils.nlp import model as embedder_model, qdrant_client

def search_context(queries, files):
    logger.info(f"Searching context for queries: {queries}")

    results = set()
    embeddings = embedder_model.encode(queries)

    for query, embedding in zip(queries, embeddings):
        qdrant_res = qdrant_client.query_points(
            collection_name="chunks",
            query=embedding,
            query_filter=qdrant_models.Filter(
                must=[
                    qdrant_models.FieldCondition(
                        key="file_name",
                        match=qdrant_models.MatchAny(any=files),
                    ),
                ]
            ),
            limit=1,
            with_payload=True,
        ).points[0]

        results.add(qdrant_res.payload["data"])

    return list(results)