import {Gate} from '@ioc:Adonis/Addons/Authorization'
import Post from 'App/Models/Post'
import PostPolicy from 'App/Policies/PostPolicy'

Gate.registerPolicies([[Post, PostPolicy]])
