/**
 * Imports.
 */
import React from 'react';
import async from 'async';
import connectToStores from 'fluxible-addons-react/connectToStores';
import {FormattedMessage} from 'react-intl';
import {Link} from 'react-router';

import {slugify} from '../../../utils/strings';

// Flux
import CollectionsStore from '../../../stores/Collections/CollectionsStore';
import ContentsListStore from '../../../stores/Contents/ContentsListStore';
import IntlStore from '../../../stores/Application/IntlStore';
import ProductsHomepageStore from '../../../stores/Products/ProductsHomepageStore';

import fetchContents from '../../../actions/Contents/fetchContents';
import fetchHomepageProducts from '../../../actions/Products/fetchHomepageProducts';

// Required components
import ArticleSummary from '../../common/articles/ArticleSummary';
import Carousel from '../../common/images/Carousel';
import ProductList from '../../common/products/ProductList';

import HomepageFeaturedCollection from './HomepageFeaturedCollection';

// Translation data for this component
import intlData from './Homepage.intl';

/**
 * Component.
 */
class Homepage extends React.Component {

    static contextTypes = {
        getStore: React.PropTypes.func.isRequired
    };

    //*** Required Data ***//

    static fetchData = function (context, params, query, done) {
        async.parallel([
            function (callback) {
                context.executeAction(fetchContents, {tags: 'homepage'}, callback);
            },
            function (callback) {
                context.executeAction(fetchHomepageProducts, {}, callback);
            }
        ], done);
    };

    //*** Initial State ***//

    state = {
        banners: this.context.getStore(ContentsListStore).getOrderedContentsOfType('banner', ['homepage'], true),
        articles: this.context.getStore(ContentsListStore).getOrderedContentsOfType('article', ['homepage'], true),
        collections: this.context.getStore(CollectionsStore).getOrderedCollections(['homepageFeatured'], true, 'homepageFeaturedOrder'),
        featuredCategories: this.context.getStore(CollectionsStore).getCollections(['category', 'homepage']),
        featuredCollections: this.context.getStore(CollectionsStore).getCollections(['collection', 'homepage']),
        featuredProducts: this.context.getStore(ProductsHomepageStore).getProducts()
    };

    //*** Component Lifecycle ***//

    componentDidMount() {

        // Component styles
        require('./Homepage.scss');
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            banners: nextProps._banners,
            articles: nextProps._articles,
            collections: nextProps._collections,
            featuredProducts: nextProps._featuredProducts,
            featuredCategories: nextProps._featuredCategories,
            featuredCollections: nextProps._featuredCollections
        });
    }

    //*** Template ***//

    render() {
        let intlStore = this.context.getStore(IntlStore);
        let routeParams = {locale: this.context.getStore(IntlStore).getCurrentLocale()};

        return (
            <div className="homepage">
                <div className="homepage__cta">
                  <div className="homepage__banners">
                      <Carousel images={this.state.banners.filter(function (banner) {
                          return banner.body && banner.body.image;
                      }).map(function (banner) {
                          return {
                              src: `//${banner.body.image.url}`,
                              link: banner.body.link
                          };
                      })} />
                  </div>
                </div>


            </div>
        );
    }
}

/**
 * Flux
 */
Homepage = connectToStores(Homepage, [CollectionsStore, ProductsHomepageStore], (context) => {
    return {
        _banners: context.getStore(ContentsListStore).getOrderedContentsOfType('banner', ['homepage'], true),
        _articles: context.getStore(ContentsListStore).getOrderedContentsOfType('article', ['homepage'], true),
        _collections: context.getStore(CollectionsStore).getOrderedCollections(['homepageFeatured'], true, 'homepageFeaturedOrder'),
        _featuredCategories: context.getStore(CollectionsStore).getCollections(['category', 'homepage']),
        _featuredCollections: context.getStore(CollectionsStore).getCollections(['collection', 'homepage']),
        _featuredProducts: context.getStore(ProductsHomepageStore).getProducts()
    };
});

/**
 * Export.
 */
export default Homepage;
