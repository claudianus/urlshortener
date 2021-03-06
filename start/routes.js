'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

const Route = use('Route')

Route.get('/',          'PageController.home').middleware('session').as('home')
Route.post('/',         'UrlController.store').middleware('session').as('store')
Route.get('/:id62',     'UrlController.redirect').as('redirect')
