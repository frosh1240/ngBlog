import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { PostService } from '../../services/posts/post/post.service';
import { PostI } from '../../models/post.interface';
import Swal from 'sweetalert2';
import {MatDialog } from '@angular/material/dialog';
import {ModalComponent} from '../modal/modal.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['titlePost', 'tagPost', 'actions'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static:true}) sort:MatSort;

  constructor(private postSvc: PostService, public dialog:MatDialog) { }

  ngAfterViewInit(): void{
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.postSvc.getAllPosts().subscribe(posts => (this.dataSource.data = posts) )
  }
 
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onNewPost(){
    this.openDialog();
  }

  onEditPost(post:PostI){
    this.openDialog(post)
  }

  onDeletePost(post:PostI){
    Swal.fire({
      title:'Are you sure?',
      text: `You won't be able to revert this!`,
      icon:'warning',
      showCancelButton: true,
      confirmButtonColor:'#308560',
      cancelButtonColor:'#d33',
      confirmButtonText:'Yes, delete it!'
    }).then(result =>{
      if(result.value){
        //quiere borrar
        this.postSvc.deletePost(post).then(() => {
          Swal.fire('Deleted!', 'Your post has been deleted.', 'success');
        }).catch((error) => {
          Swal.fire('Error!', 'There was a error deleting this post.', 'error');
        })
      }
    })
  }

  openDialog(post?:PostI):void{
    const config = {
      data: {
        message:post ? 'Edit Post'  : 'New Post',
        content:post
      }
    }
    const dialogRef = this.dialog.open(ModalComponent, config);
    dialogRef.afterClosed().subscribe(result => {
    })
  }
}
