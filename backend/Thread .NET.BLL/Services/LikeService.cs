﻿using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using System.Linq;
using System.Threading.Tasks;
using Thread_.NET.BLL.Hubs;
using Thread_.NET.BLL.Services.Abstract;
using Thread_.NET.Common.DTO.Dislike;
using Thread_.NET.Common.DTO.Like;
using Thread_.NET.DAL.Context;

namespace Thread_.NET.BLL.Services
{
    public sealed class LikeService : BaseService
    {
        private readonly IHubContext<PostHub> _postHub;

        public LikeService(ThreadContext context, IMapper mapper, IHubContext<PostHub> postHub) : base(context, mapper) 
        {
            _postHub = postHub;
        }

        public async Task<bool> LikePost(NewReactionDTO reaction)
        {
            var likes = _context.PostReactions.Where(x => x.UserId == reaction.UserId && x.PostId == reaction.EntityId);

            if (likes.Any())
            {
                _context.PostReactions.RemoveRange(likes);
                await _context.SaveChangesAsync();

                return false;
            }

            _context.PostReactions.Add(new DAL.Entities.PostReaction
            {
                PostId = reaction.EntityId,
                IsLike = reaction.IsLike,
                UserId = reaction.UserId
            });

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task DislikePost(NewNegativeReactionDTO reaction)
        {
            var dislikes = _context.PostNegativeReactions.Where(x => x.UserId == reaction.UserId && x.PostId == reaction.EntityId);

            if (dislikes.Any())
            {
                _context.PostNegativeReactions.RemoveRange(dislikes);
                await _context.SaveChangesAsync();

                return;
            }

            _context.PostNegativeReactions.Add(new DAL.Entities.PostNegativeReaction
            {
                PostId = reaction.EntityId,
                IsDislike = reaction.IsDislike,
                UserId = reaction.UserId
            });

            await _context.SaveChangesAsync();
        }

        public async Task LikeComment(NewReactionDTO reaction)
        {
            var likes = _context.CommentReactions.Where(x => x.UserId == reaction.UserId && x.CommentId == reaction.EntityId);

            if (likes.Any())
            {
                _context.CommentReactions.RemoveRange(likes);
                await _context.SaveChangesAsync();

                return;
            }

            _context.CommentReactions.Add(new DAL.Entities.CommentReaction
            {
                CommentId = reaction.EntityId,
                IsLike = reaction.IsLike,
                UserId = reaction.UserId
            });

            await _context.SaveChangesAsync();
        }

        public async Task DislikeComment(NewNegativeReactionDTO reaction)
        {
            var dislikes = _context.CommentNegativeReactions.Where(x => x.UserId == reaction.UserId && x.CommentId == reaction.EntityId);
            
            if (dislikes.Any())
            {
                _context.CommentNegativeReactions.RemoveRange(dislikes);
                await _context.SaveChangesAsync();

                return;
            }

            _context.CommentNegativeReactions.Add(new DAL.Entities.CommentNegativeReaction
            {
                CommentId = reaction.EntityId,
                IsDislike = reaction.IsDislike,
                UserId = reaction.UserId
            });

            await _context.SaveChangesAsync();
        }
    }
}
