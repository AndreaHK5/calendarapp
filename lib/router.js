Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound'
});

Router.route('/', {name: 'home', controller: AtgEventsController});

Router.route('/events', {name: 'atgEvents', controller: AtgEventsController});
Router.route('/events/create/:_id', {name: 'atgEventCreate', controller: EventCreateController});
Router.route('/events/:_id', {name: 'atgEventShow', controller: EventShowController});
Router.route('/events/:_id/edit', {name: 'atgEventEdit', controller: EventEditController});

Router.route('/products/', {name: 'productsList', controller: ProductsListController});
Router.route('/products/create', {name: 'productUpsert', controller: ProductCreateController});
Router.route('/products/:_id', {name: 'productShow', controller: ProductShowController});
Router.route('/products/:_id/edit', {name: 'productEdit', controller: ProductEditController});

Router.route('/partners', {name: 'partnersList', controller: PartnersController});
Router.route('/partners/create', {name: 'partnerCreate', controller: PartnerCreateController});
Router.route('/partners/:_id', {name: 'partnerShow', controller: PartnerShowController});
Router.route('/partners/:_id/edit', {name: 'partnerEdit', controller: PartnerEditController});