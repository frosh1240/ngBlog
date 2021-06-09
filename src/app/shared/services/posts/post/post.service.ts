import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {finalize, map} from 'rxjs/operators';
import { fileI } from '../../../models/file.interface';
import {PostI} from '../../../models/post.interface';
@Injectable({
  providedIn: 'root'
})
export class PostService {
  private postCollection: AngularFirestoreCollection<PostI>;
  private filePath: any;
  private downloadURL: Observable<string>;
  
  constructor(
    private storage:AngularFireStorage,
    private afs:AngularFirestore) {
    this.postCollection = afs.collection<PostI>('posts');
   }

  public getAllPosts():Observable<PostI[]>{
    return this.postCollection.snapshotChanges().pipe(
      map(actions => 
        actions.map( a => {
          const data = a.payload.doc.data() as PostI;
          const id = a.payload.doc.id;
          return {id, ...data};
        })
      )
    )
  }

  public getOnePost(id:PostI):Observable<PostI>{
    return this.afs.doc<PostI>(`posts/${id}`).valueChanges();
  }

  public deletePost(post:PostI){
    return this.postCollection.doc(post.id).delete();
  }

  public editPostByEdit(post:PostI, newImage?:fileI){
    if(newImage){
      this.uploadImage(post,newImage)
    }else{
      return this.postCollection.doc(post.id).update(post);
    }
  }

  public preAddAndUpdatePost(post:PostI, image:fileI){
    this.uploadImage(post,image);
  }

  private savePost(post:PostI){
    const postObj = {
      titlePost:post.titlePost,
      contentPost:post.contentPost,
      imagePost:this.downloadURL,
      fileRef:this.filePath,
      tagsPost:post.tagsPost
    }

    if(post.id){
      return this.postCollection.doc(post.id).update(postObj)
    }else{
      return this.postCollection.add(postObj)
    }
  }
  
  private uploadImage(post:PostI, image:fileI){
    this.filePath = `images/${image.name}`;
    const fileRef = this.storage.ref(this.filePath);
    const task = this.storage.upload(this.filePath, image);
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(urlImage => {
          this.downloadURL = urlImage;
          this.savePost(post)
        })
      })
    ).subscribe();
  }
}
