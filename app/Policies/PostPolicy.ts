import { User } from '@ioc:Adonis/Addons/Authorization'
import Post from 'App/Models/Post'

export default class PostPolicy {
  public create (user: User) {
    // Only specific users can create new posts
    return user.id === 1 || user.id === 2
  }

  // TODO: implement allowGuest decorator.
  // @allowGuest()
  public show (user: User | undefined, post: Post) {
    if (post.isPublic) {
      // Public posts can be viewed by anyone, including guests.
      return true
    }

    if (!user) {
      // If the post isn't public, guests may never see it.
      return false
    }

    return user.id === post.userId
  }
}
