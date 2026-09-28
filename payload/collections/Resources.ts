// Payload CMS Configuration - Temporarily disabled for build
/*
import { CollectionConfig } from 'payload/types';

export const Resources: CollectionConfig = {
  slug: 'resources',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Article', value: 'article' },
        { label: 'Guide', value: 'guide' },
        { label: 'Video', value: 'video' },
        { label: 'Template', value: 'template' },
      ],
      defaultValue: 'article',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Student Resources', value: 'student' },
        { label: 'Company Resources', value: 'company' },
        { label: 'University Resources', value: 'university' },
        { label: 'Supervisor Resources', value: 'supervisor' },
      ],
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'publishedAt',
      type: 'date',
    },
  ],
};
*/
