<?php

namespace Shopware\CartBridge\Modifier;

use Shopware\Api\Context\Repository\ContextCartModifierRepository;
use Shopware\Api\Entity\Search\Criteria;
use Shopware\Api\Entity\Search\Query\TermQuery;
use Shopware\Api\Entity\Search\Query\TermsQuery;
use Shopware\Cart\Cart\CartCollectorInterface;
use Shopware\Cart\Cart\Struct\Cart;
use Shopware\CartBridge\Modifier\Struct\ContextCartModifierFetchDefinition;
use Shopware\Context\Struct\StorefrontContext;
use Shopware\Framework\Struct\StructCollection;

// TODO@JU REMOVE WHOLE CLASS?
class ContextCartModifierCollector implements CartCollectorInterface
{

    /**
     * @var ContextCartModifierRepository
     */
    private $repository;

    public function __construct(ContextCartModifierRepository $contextCartModifierRepository)
    {
        $this->repository = $contextCartModifierRepository;
    }

    public function prepare(
        StructCollection $fetchDefinition,
        Cart $cart,
        StorefrontContext $context
    ): void
    {
        $contextRuleIds = $context->getContextRulesIds();

        if (!$contextRuleIds) {
            return;
        }
        
        $fetchDefinition->add(new ContextCartModifierFetchDefinition($contextRuleIds));
    }

    public function fetch(
        StructCollection $dataCollection,
        StructCollection $fetchCollection,
        StorefrontContext $context
    ): void
    {
        $definitions = $fetchCollection->filterInstance(ContextCartModifierFetchDefinition::class);

        if ($definitions->count() === 0) {
            return;
        }

        $ids = [];
        /** @var ContextCartModifierFetchDefinition[] $definitions */
        foreach ($definitions as $definition) {
            $ids = array_merge($ids, $definition->getIds());
        }

        $criteria = new Criteria();
        $criteria->addFilter(new TermsQuery('context_cart_modifier.contextRuleId', $ids));
        $contextCartModifiers = $this->repository->search($criteria, $context->getShopContext())->getElements();

        $dataCollection->fill($contextCartModifiers);
    }
}