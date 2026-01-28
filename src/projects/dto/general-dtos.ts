export const ProjectUploadSchema = {
  schema: {
    type: 'object',
    properties: {
      images: {
        type: 'array',
        items: {
          type: 'string',
          format: 'binary',
        },
      },
      title: { type: 'string' },
      description: { type: 'string' },
      liveUrl: { type: 'string' },
      githubUrl: { type: 'string' },
      projectGoal: { type: 'string' },
      projectOutCome: { type: 'string' },
      techIds:{type:'array',items:{type:'string'}}
    },
    required: ['title', 'projectGoal', 'projectOutCome'],
  },
};
