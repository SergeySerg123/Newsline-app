import { Injectable } from '@angular/core';
import { HttpInternalService } from './http-internal.service';
import { Post } from '../models/post/post';
import { NewReaction } from '../models/reactions/newReaction';
import { NewPost } from '../models/post/new-post';
import { NewNegativeReaction } from '../models/negativeReactions/newNegativeReaction';
import { SharePostByEmail } from '../models/post/share-post-by-email';

@Injectable({ providedIn: 'root' })
export class PostService {
    public routePrefix = '/api/posts';

    constructor(private httpService: HttpInternalService) {}

    public deletePost(postId: number) {
        return this.httpService.deleteFullRequest(`${this.routePrefix}/` + postId.toString());
    }

    public updatePost(post: Post) {
        return this.httpService.putFullRequest<Post>(`${this.routePrefix}`, post);    
    }

    public getPosts() {
        return this.httpService.getFullRequest<Post[]>(`${this.routePrefix}/all`);
    }

    public getMorePosts(pageSize: number, threadPage: number, isOnlyMine: boolean) {
        return this.httpService.getFullRequest<Post[]>(`${this.routePrefix}/all`, { pageSize, threadPage, isOnlyMine });
    }

    public createPost(post: NewPost) {
        return this.httpService.postFullRequest<Post>(`${this.routePrefix}`, post);
    }

    public likePost(reaction: NewReaction) {
        return this.httpService.postFullRequest<Post>(`${this.routePrefix}/like`, reaction);
    }

    public dislikePost(reaction: NewNegativeReaction) {
        return this.httpService.postFullRequest<Post>(`${this.routePrefix}/dislike`, reaction);
    }

    public sharePostByEmail(sharePost: SharePostByEmail) {
        return this.httpService.postFullRequest<Post>(`${this.routePrefix}/share-post-by-email`, sharePost);
    }
}
