import React from 'react';
import { useParams } from 'react-router-dom';
import StoryForm from '../../components/Story/StoryForm';
import WriterLayout from '../../components/Layout/WriterLayout';

const EditStory = () => {
  const { id } = useParams();
  
  return (
    <WriterLayout>
      <StoryForm />
    </WriterLayout>
  );
};

export default EditStory;