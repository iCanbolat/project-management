import { useState, useEffect } from 'react';
import { useCollection } from '../../hooks/useCollection';
import { useAuthContext } from '../../hooks/useAuthContext';
import { timestamp } from '../../firebase/config';
import { useFirestore } from '../../hooks/useFirestore';
import { useHistory } from 'react-router';
import Select from 'react-select';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';

import './Create.css';

const categories = [
  { value: 'development', label: 'Development' },
  { value: 'design', label: 'Design' },
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
];

const schema = yup
  .object({
    name: yup.string().max(30, 'You have reached maximum character').required(),
    details: yup.string().required('Explain your task details shortly'),
    dueDate: yup.string().required('Select due date'),
    assignedUsers: yup.array().required('Assign 1 person at least'),
    category: yup
      .mixed()
      .oneOf(['development', 'design', 'sales', 'marketing'])
      .required(),
  })
  .required();

export default function Create() {
  const history = useHistory();
  const { addDocument, response } = useFirestore('projects');
  const { user } = useAuthContext();
  const { documents } = useCollection('users');
  const [users, setUsers] = useState([]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // create user values for react-select
  useEffect(() => {
    if (documents) {
      setUsers(
        documents.map((user) => {
          return { value: { ...user, id: user.id }, label: user.displayName };
        })
      );
    }
  }, [documents]);

  const onSubmit = async (data) => {
    const { name, details, assignedUsers, category, dueDate } = data;
    const assignedUsersList = assignedUsers.map((u) => {
      return {
        displayName: u.value.displayName,
        photoURL: u.value.photoURL,
        id: u.value.id,
      };
    });
    const createdBy = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      id: user.uid,
    };
    const project = {
      name,
      details,
      assignedUsersList,
      createdBy,
      category,
      dueDate: timestamp.fromDate(new Date(dueDate)),
      comments: [],
    };
    await addDocument(project);
    if (!response.error) {
      history.push('/');
    }
  };
  return (
    <div className='create-form'>
      <h2 className='page-title'>Create a new Task</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          <span>Task name:</span>
          <input {...register('name')} />
          {errors.name && (
            <p className='error'>
              <small>{errors.name?.message}</small>{' '}
            </p>
          )}
        </label>
        <label>
          <span>Task Details:</span>
          <textarea {...register('details')}></textarea>
          {errors.details && (
            <p className='error'>
              <small> {errors.details.message}</small>{' '}
            </p>
          )}
        </label>
        <label>
          <span>Set due date:</span>
          <input {...register('dueDate')} type='date' />
          {errors.dueDate && (
            <p className='error'>
              <small>{errors.dueDate.message}</small>{' '}
            </p>
          )}
        </label>
        <label>
          <span>Task category:</span>
          <Controller
            control={control}
            render={({ field: { onChange } }) => (
              <Select
                onChange={(option) => onChange(option.value)}
                options={categories}
              />
            )}
            name='category'
          />
          {errors.category && (
            <p className='error'>
              {' '}
              <small>{errors.category.message}</small>{' '}
            </p>
          )}

          {/*<Select
            onChange={(option) => setCategory(option)}
            options={categories}
          />*/}
        </label>
        <label>
          <span>Assign to:</span>
          <Controller
            control={control}
            render={({ field: { onChange } }) => (
              <Select
                onChange={(option) => onChange(option)}
                options={users}
                isMulti
              />
            )}
            name='assignedUsers'
          />{' '}
          {errors.assignedUsers && (
            <p className='error'>
              {' '}
              <small>{errors.assignedUsers.message}</small>{' '}
            </p>
          )}
          {/*<Select
            onChange={(option) => setAssignedUsers(option)}
            options={users}
            isMulti
          />*/}
        </label>

        <button type='submit' className='btn'>
          Add Task
        </button>
      </form>
    </div>
  );
}
