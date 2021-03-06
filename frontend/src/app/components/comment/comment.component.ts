import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { Comment } from '../../models/comment/comment';
import { User } from 'src/app/models/user';
import { Observable, empty, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/auth.service';
import { LikeService } from 'src/app/services/like.service';
import { AuthDialogService } from 'src/app/services/auth-dialog.service';
import { DialogType } from 'src/app/models/common/auth-dialog-type';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.sass']
})
export class CommentComponent implements OnInit {
    @Input() public comment: Comment;  
    @Input() public currentUser: User;  
    @Output() public deleteClick = new EventEmitter<number>();
    @Output() public editClick = new EventEmitter<number>();

    public likePhotos = [];
    private unsubscribe$ = new Subject<void>();

    @ViewChild('tt', {static: false}) tooltip: NgbTooltip;

    public constructor(
        private authService: AuthenticationService,
        private authDialogService: AuthDialogService,
        private likeService: LikeService
        ) { }

    public ngOnInit() {
        this.setLikePhotos();
    }

    public deleteComment(commentId: number) {
        this.deleteClick.emit(commentId);
    }

    public editComment(commentId: number) {
        this.editClick.emit(commentId);
    }

    public likeComment() {
        if (!this.currentUser) {
            this.catchErrorWrapper(this.authService.getUser())
                .pipe(
                    switchMap((userResp) => this.likeService.likeComment(this.comment, userResp)),
                    takeUntil(this.unsubscribe$)
                )
                .subscribe((comment) => (this.setCommentData(comment)));

            return;
        }

        this.likeService
            .likeComment(this.comment, this.currentUser)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((comment) => (this.setCommentData(comment)));
    }

    public dislikeComment() {
        if (!this.currentUser) {
            this.catchErrorWrapper(this.authService.getUser())
                .pipe(
                    switchMap((userResp) => this.likeService.dislikeComment(this.comment, userResp)),
                    takeUntil(this.unsubscribe$)
                )
                .subscribe((comment) => (this.setCommentData(comment)));

            return;
        }

        this.likeService
            .dislikeComment(this.comment, this.currentUser)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((comment) => (this.setCommentData(comment)));
    }

    public openAuthDialog() {
        this.authDialogService.openAuthDialog(DialogType.SignIn);
    }

    public isAuthor() {
        let currentUserId = this.currentUser.id;
        let commentUserId = this.comment.author.id;
        return currentUserId === commentUserId;
    }

    private catchErrorWrapper(obs: Observable<User>) {
        return obs.pipe(
            catchError(() => {
                this.openAuthDialog();
                return empty();
            })
        );
    }

    private setCommentData(comment: Comment) {
        this.comment = comment;
        this.setLikePhotos();
    }

    private setLikePhotos() {
        this.likePhotos = [];      
        if ( this.comment.reactions.length > 0 ) {          
            this.comment.reactions.forEach(r => {
                this.likePhotos.push(r.user.avatar);
            });           
        }
    }
}
