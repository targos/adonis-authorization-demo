import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class PostsController {
  public async index (ctx: HttpContextContract) {
    const query = Post.query().where('isPublic', true)
    if (ctx.auth.user) {
      query.orWhere('userId', ctx.auth.user.id)
    }
    const posts = await query.exec()
    return ctx.view.render('posts/index', { user: ctx.auth.user, posts, numPosts: posts.length })
  }

  public async create (ctx: HttpContextContract) {
    return ctx.view.render('posts/create', { user: ctx.auth.user })
  }

  public async store (ctx: HttpContextContract) {
    await ctx.auth.authenticate()
    if (!ctx.auth.user) {
      throw new Error('unreachable')
    }

    const validationSchema = schema.create({
      name: schema.string({ trim: true }, [
        rules.unique({ table: 'posts', column: 'name' }),
      ]),
      contents: schema.string({ trim: true }),
    })

    const postDetails = await ctx.request.validate({
      schema: validationSchema,
    })

    const post = await Post.create({
      ...postDetails,
      userId: ctx.auth.user.id,
    })

    return ctx.response.redirect(`/posts/${post.id}`)
  }

  public async show (ctx: HttpContextContract) {
    console.log(ctx.params)
    const post = await Post.findByOrFail('id', ctx.params.id)

    return ctx.view.render('posts/show', { user: ctx.auth.user, post })
  }

  // public async edit (ctx: HttpContextContract) {
  // }

  // public async update (ctx: HttpContextContract) {
  // }

  // public async destroy (ctx: HttpContextContract) {
  // }
}
