import { describe, it, expectTypeOf } from 'vitest';
import type { RemoveNonAlphabeticCharactersFromRecordEntries } from '../../src/types/extractParams';

describe('RemoveNonAlphabeticCharactersFromRecordEntries', () => {
  describe('Basic sanitization', () => {
    it('should remove non-alphabetic characters from record keys', () => {
      type Input = { 'user_id': string; 'post-id': number };
      type Return = { 'userid': string; 'postid': number };
      type Result = RemoveNonAlphabeticCharactersFromRecordEntries<Input, Return>;
      const k: Result = null;

      expectTypeOf<Result>().toEqualTypeOf<{
        userid: string;
        postid: number;
      }>();
    });

    it('should handle keys with numbers', () => {
      type Input = { 'param123': string; 'value456': boolean };
      type Return = { 'param': string; 'value': boolean };
      type Result = RemoveNonAlphabeticCharactersFromRecordEntries<Input, Return>;
      
      expectTypeOf<Result>().toEqualTypeOf<{
        param: string;
        value: boolean;
      }>();
    });

    it('should handle keys with special characters', () => {
      type Input = { 'user@id': string; 'post#tag': number; 'item$price': boolean };
      type Return = { 'userid': string; 'posttag': number; 'itemprice': boolean };
      type Result = RemoveNonAlphabeticCharactersFromRecordEntries<Input, Return>;
      
      expectTypeOf<Result>().toEqualTypeOf<{
        userid: string;
        posttag: number;
        itemprice: boolean;
      }>();
    });
  });

  describe('Complex key patterns', () => {
    it('should handle keys with mixed special characters', () => {
      type Input = { 'my-param_name': string; 'another.key!value': number };
      type Return = { 'myparamname': string; 'anotherkeyvalue': number };
      type Result = RemoveNonAlphabeticCharactersFromRecordEntries<Input, Return>;
      
      expectTypeOf<Result>().toEqualTypeOf<{
        myparamname: string;
        anotherkeyvalue: number;
      }>();
    });

    it('should handle keys with spaces', () => {
      type Input = { 'user name': string; 'post title': number };
      type Return = { 'username': string; 'posttitle': number };
      type Result = RemoveNonAlphabeticCharactersFromRecordEntries<Input, Return>;
      
      expectTypeOf<Result>().toEqualTypeOf<{
        username: string;
        posttitle: number;
      }>();
    });

    it('should preserve case sensitivity', () => {
      type Input = { 'UserId': string; 'PostID': number; 'itemName': boolean };
      type Return = { 'UserId': string; 'PostID': number; 'itemName': boolean };
      type Result = RemoveNonAlphabeticCharactersFromRecordEntries<Input, Return>;
      
      expectTypeOf<Result>().toEqualTypeOf<{
        UserId: string;
        PostID: number;
        itemName: boolean;
      }>();
    });
  });

  describe('Type preservation', () => {
    it('should preserve string types', () => {
      type Input = { 'key-1': unknown; 'key-2': unknown };
      type Return = { 'key1': string; 'key2': string };
      type Result = RemoveNonAlphabeticCharactersFromRecordEntries<Input, Return>;
      
      expectTypeOf<Result>().toEqualTypeOf<{
        key1: string;
        key2: string;
      }>();
    });

    it('should preserve number types', () => {
      type Input = { 'id$': unknown; 'count$': unknown };
      type Return = { 'id': number; 'count': number };
      type Result = RemoveNonAlphabeticCharactersFromRecordEntries<Input, Return>;
      
      expectTypeOf<Result>().toEqualTypeOf<{
        id: number;
        count: number;
      }>();
    });

    it('should preserve Date types', () => {
      type Input = { 'created(': unknown; 'updated(': unknown };
      type Return = { 'created': Date; 'updated': Date };
      type Result = RemoveNonAlphabeticCharactersFromRecordEntries<Input, Return>;
      
      expectTypeOf<Result>().toEqualTypeOf<{
        created: Date;
        updated: Date;
      }>();
    });

    it('should preserve boolean types', () => {
      type Input = { 'active^': unknown; 'enabled^': unknown };
      type Return = { 'active': boolean; 'enabled': boolean };
      type Result = RemoveNonAlphabeticCharactersFromRecordEntries<Input, Return>;
      
      expectTypeOf<Result>().toEqualTypeOf<{
        active: boolean;
        enabled: boolean;
      }>();
    });

    it('should preserve optional types', () => {
      type Input = { '?param$': unknown; '?value^': unknown };
      type Return = { 'param': number | undefined; 'value': boolean | undefined };
      type Result = RemoveNonAlphabeticCharactersFromRecordEntries<Input, Return>;
      
      expectTypeOf<Result>().toEqualTypeOf<{
        param: number | undefined;
        value: boolean | undefined;
      }>();
    });
  });

  describe('Multiple entries', () => {
    it('should handle records with multiple entries', () => {
      type Input = {
        'user_id': unknown;
        'post-id': unknown;
        'comment#id': unknown;
        'tag@name': unknown;
      };
      type Return = {
        'userid': string;
        'postid': number;
        'commentid': number;
        'tagname': string;
      };
      type Result = RemoveNonAlphabeticCharactersFromRecordEntries<Input, Return>;
      
      expectTypeOf<Result>().toEqualTypeOf<{
        userid: string;
        postid: number;
        commentid: number;
        tagname: string;
      }>();
    });

    it('should handle complex record with mixed types', () => {
      type Input = {
        'user-name': unknown;
        'age$': unknown;
        'created-at(': unknown;
        'is-active^': unknown;
        '?optional-param$': unknown;
      };
      type Return = {
        'username': string;
        'age': number;
        'createdat': Date;
        'isactive': boolean;
        'optionalparam': number | undefined;
      };
      type Result = RemoveNonAlphabeticCharactersFromRecordEntries<Input, Return>;
      
      expectTypeOf<Result>().toEqualTypeOf<{
        username: string;
        age: number;
        createdat: Date;
        isactive: boolean;
        optionalparam: number | undefined;
      }>();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty record', () => {
      type Input = {};
      type Return = {};
      type Result = RemoveNonAlphabeticCharactersFromRecordEntries<Input, Return>;
      
      expectTypeOf<Result>().toEqualTypeOf<{}>();
    });

    it('should handle single entry', () => {
      type Input = { 'single-key': unknown };
      type Return = { 'singlekey': string };
      type Result = RemoveNonAlphabeticCharactersFromRecordEntries<Input, Return>;
      
      expectTypeOf<Result>().toEqualTypeOf<{
        singlekey: string;
      }>();
    });

    it('should handle keys that are already clean', () => {
      type Input = { 'username': unknown; 'email': unknown };
      type Return = { 'username': string; 'email': string };
      type Result = RemoveNonAlphabeticCharactersFromRecordEntries<Input, Return>;
      
      expectTypeOf<Result>().toEqualTypeOf<{
        username: string;
        email: string;
      }>();
    });

    it('should handle keys with only special characters removed', () => {
      type Input = { '!!!': unknown; '@@@': unknown };
      type Return = { '': string; '': number };
      type Result = RemoveNonAlphabeticCharactersFromRecordEntries<Input, Return>;
      
      // Both keys become empty string, so they merge
      expectTypeOf<Result>().toMatchTypeOf<Record<string, any>>();
    });
  });

  describe('Real-world usage scenarios', () => {
    it('should work with route parameter extraction', () => {
      type Input = {
        'user-id$': unknown;
        'post_slug': unknown;
        'created-at(': unknown;
      };
      type Return = {
        'userid': number;
        'postslug': string;
        'createdat': Date;
      };
      type Result = RemoveNonAlphabeticCharactersFromRecordEntries<Input, Return>;
      
      expectTypeOf<Result>().toEqualTypeOf<{
        userid: number;
        postslug: string;
        createdat: Date;
      }>();
    });

    it('should work with API query parameters', () => {
      type Input = {
        '?page$': unknown;
        '?limit$': unknown;
        '?sort-by': unknown;
        '?filter-active^': unknown;
      };
      type Return = {
        'page': number | undefined;
        'limit': number | undefined;
        'sortby': string | undefined;
        'filteractive': boolean | undefined;
      };
      type Result = RemoveNonAlphabeticCharactersFromRecordEntries<Input, Return>;
      
      expectTypeOf<Result>().toEqualTypeOf<{
        page: number | undefined;
        limit: number | undefined;
        sortby: string | undefined;
        filteractive: boolean | undefined;
      }>();
    });
  });
});
