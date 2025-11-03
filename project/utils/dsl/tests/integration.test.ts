import { describe, it, expectTypeOf } from 'vitest';
import { ExtractParams } from '@';
import { Optionable } from '@blazyts/better-standard-library';
import * as l from '@blazyts/better-standard-library';


describe('DSL Integration Tests', () => {
  describe('REST API Routes', () => {
    it('should handle CRUD operations for users', () => {
      {

      type GetUser = ExtractParams<'/api/users/:id$/'>;
      const input: GetUser;
      
      expectTypeOf<GetUser>().toEqualTypeOf<{id: number}>();
      
      }
      {
        type UpdateUser = ExtractParams<'/api/users/:userId$/profile'>;
        const input: UpdateUser;
        expectTypeOf<UpdateUser>().toEqualTypeOf<{ userId: number }>();
      }
      {
        // it is important to afterfix the path with /, in the future it will be fixed but for now it simplifies the code a lot
        type ListUsers = ExtractParams<'/api/users/:?page$/:?limit$/'>;
        const input2: ListUsers;
        expectTypeOf<ListUsers>().toEqualTypeOf<{
        page: Optionable<number>;
        limit: Optionable<number>;
      }>();

      }
    });

    it('should handle nested resources', () => {
      type GetComment = ExtractParams<'/api/posts/:postId$/comments/:commentId$/'>;
      expectTypeOf<GetComment>().toEqualTypeOf<{
        postId: number;
        commentId: number;
      }>();

      type GetReply = ExtractParams<'/api/posts/:postId$/comments/:commentId$/replies/:replyId$/'>;
      expectTypeOf<GetReply>().toEqualTypeOf<{
        postId: number;
        commentId: number;
        replyId: number;
      }>();
    });
  });

  describe('E-commerce Routes', () => {
    it('should handle product routes', () => {
      type GetProduct = ExtractParams<'/shop/products/:productId$/details'>;
      expectTypeOf<GetProduct>().toEqualTypeOf<{ productId: number }>();

      type FilterProducts = ExtractParams<'/shop/category/:category/:?inStock^/:?minPrice$/:?maxPrice$/'>;
      expectTypeOf<FilterProducts>().toEqualTypeOf<{
        category: string;
        inStock: Optionable<boolean>;
        minPrice: Optionable<number>;
        maxPrice: Optionable<number>;
      }>();
    });

    it('should handle order routes', () => {
      type GetOrder = ExtractParams<'/orders/:orderId$/status'>;
      expectTypeOf<GetOrder>().toEqualTypeOf<{ orderId: number }>();

      type TrackOrder = ExtractParams<'/orders/:orderId$/tracking/:trackingId$/'>;
      expectTypeOf<TrackOrder>().toEqualTypeOf<{
        orderId: number;
        trackingId: number;
      }>();
    });
  });

  describe('Blog/CMS Routes', () => {
    it('should handle blog post routes', () => {
      type GetPost = ExtractParams<'/blog/:year$/:month$/:day$/:slug/'>;
      expectTypeOf<GetPost>().toEqualTypeOf<{
        year: number;
        month: number;
        day: number;
        slug: string;
      }>();

      type GetPostByDate = ExtractParams<'/blog/:date(/:slug/'>;
      expectTypeOf<GetPostByDate>().toEqualTypeOf<{
        date: Date;
        slug: string;
      }>();
    });

    it('should handle category and tag routes', () => {
      type GetCategory = ExtractParams<'/blog/category/:category/:?page$/'>;
      expectTypeOf<GetCategory>().toEqualTypeOf<{
        category: string;
        page: Optionable<number>;
      }>();

      type GetTag = ExtractParams<'/blog/tag/:tag/:?published^/'>;
      expectTypeOf<GetTag>().toEqualTypeOf<{
        tag: string;
        published: Optionable<boolean>;
      }>();
    });
  });

  describe('Admin Dashboard Routes', () => {
    it('should handle user management routes', () => {
      type ManageUser = ExtractParams<'/admin/users/:userId$/edit/:?verified^/'>;
      expectTypeOf<ManageUser>().toEqualTypeOf<{
        userId: number;
        verified: Optionable<boolean>;
      }>();

      type UserActivity = ExtractParams<'/admin/users/:userId$/activity/:from(/:to(/'>;
      expectTypeOf<UserActivity>().toEqualTypeOf<{
        userId: number;
        from: Date;
        to: Date;
      }>();
    });

    it('should handle analytics routes', () => {
      type Analytics = ExtractParams<'/admin/analytics/:metric/:startDate(/:endDate(/'>;
      expectTypeOf<Analytics>().toEqualTypeOf<{
        metric: string;
        startDate: Date;
        endDate: Date;
      }>();
    });
  });

  describe('Social Media Routes', () => {
    it('should handle user profile routes', () => {
      type GetProfile = ExtractParams<'/users/:username/profile'>;
      expectTypeOf<GetProfile>().toEqualTypeOf<{ username: string }>();

      type GetFollowers = ExtractParams<'/users/:userId$/followers/:?page$//:?verified^/'>;
      expectTypeOf<GetFollowers>().toEqualTypeOf<{
        userId: number;
        page: Optionable<number>;
        verified: Optionable<boolean>;
      }>();
    });

    it('should handle post and interaction routes', () => {
      type GetPost = ExtractParams<'/posts/:postId$/likes/:?count$/'>;
      expectTypeOf<GetPost>().toEqualTypeOf<{
        postId: number;
        count: Optionable<number>;
      }>();

      type GetComments = ExtractParams<'/posts/:postId$/comments/:?sort/:?limit$/'>;
      expectTypeOf<GetComments>().toEqualTypeOf<{
        postId: number;
        sort: Optionable<string>;
        limit: Optionable<number>;
      }>();
    });
  });

  describe('File Management Routes', () => {
    it('should handle file operations', () => {
      type GetFile = ExtractParams<'/files/:fileId$/download/'>;
      expectTypeOf<GetFile>().toEqualTypeOf<{ fileId: number }>();

      type GetFolder = ExtractParams<'/folders/:folderId$/files/:?recursive^/'>;
      expectTypeOf<GetFolder>().toEqualTypeOf<{
        folderId: number;
        recursive: Optionable<boolean>;
      }>();
    });

    it('should handle versioned files', () => {
      type GetVersion = ExtractParams<'/files/:fileId$/versions/:versionId$/:?download^/'>;
      expectTypeOf<GetVersion>().toEqualTypeOf<{
        fileId: number;
        versionId: number;
        download: Optionable<boolean>;
      }>();
    });
  });

  describe('Multi-tenant Routes', () => {
    it('should handle organization-scoped routes', () => {
      type OrgResource = ExtractParams<'/orgs/:orgId$/projects/:projectId$/tasks/:taskId$/'>;
      expectTypeOf<OrgResource>().toEqualTypeOf<{
        orgId: number;
        projectId: number;
        taskId: number;
      }>();

      type OrgSettings = ExtractParams<'/orgs/:orgSlug/settings/:section/:?active^/'>;
      expectTypeOf<OrgSettings>().toEqualTypeOf<{
        orgSlug: string;
        section: string;
        active: Optionable<boolean>;
      }>();
    });
  });

  describe('API Versioning Routes', () => {
    it('should handle versioned API endpoints', () => {
      type V1Endpoint = ExtractParams<'/api/v1/users/:userId$/posts/:postId$/'>;
      expectTypeOf<V1Endpoint>().toEqualTypeOf<{
        userId: number;
        postId: number;
      }>();

      type V2Endpoint = ExtractParams<'/api/v2/users/:userId$/feed/:?since(/:?limit$/)>'>;
      expectTypeOf<V2Endpoint>().toEqualTypeOf<{
        userId: number;
        since: Optionable<Date>;
        limit: Optionable<number>;
      }>();
    });
  });
});
