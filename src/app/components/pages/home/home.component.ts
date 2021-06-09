import { Component, OnInit } from '@angular/core';
import {PostService} from '../../../shared/services/posts/post/post.service';
import {PostI} from '../../../shared/models/post.interface';
import { Observable } from 'rxjs/internal/Observable';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public posts$ : Observable<PostI[]>;
  
  constructor(private postSvc: PostService) { }

  ngOnInit(): void {
    //this.postSvc.getAllPosts().subscribe(res => console.log('posts',res));
    this.posts$ = this.postSvc.getAllPosts();
  }

 
}
