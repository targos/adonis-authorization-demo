/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ view, auth }) => {
  return view.render('index', { user: auth.user })
}).middleware('silentAuth')

Route.group(() => {
  Route.on('register').render('auth/register')
  Route.post('register', 'AuthController.register')
  Route.on('login').render('auth/login')
  Route.post('login', 'AuthController.login')
  Route.get('logout', async ({ auth, response}) => {
    await auth.logout()
    return response.redirect('/')
  })
}).prefix('auth')
