import { gate, User, UserOrGuest } from '@ioc:Adonis/Addons/Authorization'
import Post from 'App/Models/Post'

export default class PostPolicy {
  // TODO: make decorator automatically set the type of `user`
  @gate()
  public create (user: User) {
    // Only specific users can create new posts
    return user.id === 1 || user.id === 2
  }

  // TODO: make it so that `user: User` is a type error
  @gate({ allowGuest: true })
  public show (user: UserOrGuest, post: Post) {
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
