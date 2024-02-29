import { useState } from 'react';
import { timestamp } from '../../firebase/config';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFirestore } from '../../hooks/useFirestore';
import Avatar from '../../components/Avatar';
import { formatDistanceToNow } from 'date-fns';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup
  .object({
    content: yup
      .string()
      .max(30, 'You have reached maximum character')
      .required(),
  })
  .required();

export default function ProjectComments({ project }) {
  const { user } = useAuthContext();
  const { updateDocument, response } = useFirestore('projects');
  const [newComment, setNewComment] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async ({ content }) => {
    const commentToAdd = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      content,
      createdAt: timestamp.fromDate(new Date()),
      id: Math.random(),
    };

    await updateDocument(project.id, {
      comments: [...project.comments, commentToAdd],
    });
    if (!response.error) {
      resetField('content');
    }
  };

  return (
    <div className='project-comments'>
      <h4>Task Comments</h4>

      <ul>
        {project.comments.length > 0 &&
          project.comments.map((comment) => (
            <li key={comment.id}>
              <div className='comment-author'>
                <Avatar src={comment.photoURL} />
                <p>{comment.displayName}</p>
              </div>
              <div className='comment-date'>
                <p>
                  {formatDistanceToNow(comment.createdAt.toDate(), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <div className='comment-content'>
                <p>{comment.content}</p>
              </div>
            </li>
          ))}
      </ul>

      <form className='add-comment' onSubmit={handleSubmit(onSubmit)}>
        <label>
          <span>Add new comment:</span>
          <textarea {...register('content')}></textarea>
        </label>
        {errors.content && (
          <p className='error'>
            <small>{errors.content.message}</small>{' '}
          </p>
        )}
        <button type='submit' className='btn'>
          Add Comment
        </button>
      </form>
    </div>
  );
}
