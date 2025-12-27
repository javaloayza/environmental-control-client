/* eslint-disable quotes */
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api.service';
import type { ExamplePost } from '@core/models/example-post';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private api = inject(ApiService);


  getPosts(): Promise<ExamplePost[]> {
    const apiUrl = `posts`;
    return firstValueFrom(this.api.getData<ExamplePost[]>(apiUrl, {}));
  }

  getPostById(id: number): Promise<ExamplePost> {
    const apiUrl = `posts/${id}`;
    return firstValueFrom(this.api.getData<ExamplePost>(apiUrl));
  }

  createPost(post: ExamplePost): Promise<ExamplePost> {
    const apiUrl = `posts`;
    return firstValueFrom(this.api.postData<ExamplePost>(apiUrl, post));
  }
}
