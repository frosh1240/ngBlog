import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { PostI } from 'src/app/shared/models/post.interface';
import {PostService} from '../../../shared/services/posts/post/post.service';



@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  public posts$: Observable<PostI>;
  
  constructor(private route: ActivatedRoute, private postSvc:PostService) { }

  ngOnInit(): void {
    const idPost= this.route.snapshot.params.id;
    this.posts$ = this.postSvc.getOnePost(idPost);

  }

}
