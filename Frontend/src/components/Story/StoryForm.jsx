import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createStory, updateStory, fetchStoryById, clearError, clearSuccess } from '../../store/slices/storySlice';
import { fetchCategories } from '../../store/slices/categorySlice';
import { fetchTargetAudiences } from '../../store/slices/targetAudienceSlice';
import TiptapEditor from '../TiptapEditor'; // Make sure this path is correct

const StoryForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentStory, loading, error, success } = useSelector((state) => state.story);
  const { categories } = useSelector((state) => state.category);
  const { targetAudiences } = useSelector((state) => state.targetAudience);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    categories: [],
    tags: [],
    mainCharacters: [{ name: '', description: '', role: 'protagonist' }],
    targetAudience: '',
    language: 'English',
    copyright: 'all-rights-reserved',
    status: 'draft'
  });

  const [coverImage, setCoverImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [bannerPreview, setBannerPreview] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchTargetAudiences());

    if (id) {
      dispatch(fetchStoryById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && currentStory) {
      setFormData({
        title: currentStory.title || '',
        description: currentStory.description || '',
        content: currentStory.content || '',
        categories: currentStory.categories?.map(cat => cat._id) || [],
        tags: currentStory.tags || [],
        mainCharacters: currentStory.mainCharacters?.length > 0 
          ? currentStory.mainCharacters 
          : [{ name: '', description: '', role: 'protagonist' }],
        targetAudience: currentStory.targetAudience?._id || '',
        language: currentStory.language || 'English',
        copyright: currentStory.copyright || 'all-rights-reserved',
        status: currentStory.status || 'draft'
      });
      setCoverPreview(currentStory.coverImage?.url || '');
      setBannerPreview(currentStory.bannerImage?.url || '');
    }
  }, [currentStory, id]);

  useEffect(() => {
    if (success) {
      dispatch(clearSuccess());
      navigate('/writer/stories');
    }
  }, [success, navigate, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContentChange = (newContent) => {
    setFormData(prev => ({
      ...prev,
      content: newContent
    }));
  };

  const handleCategoryChange = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTagAdd();
    }
  };

  const handleCharacterChange = (index, field, value) => {
    const updatedCharacters = [...formData.mainCharacters];
    updatedCharacters[index][field] = value;
    setFormData(prev => ({
      ...prev,
      mainCharacters: updatedCharacters
    }));
  };

  const addCharacter = () => {
    setFormData(prev => ({
      ...prev,
      mainCharacters: [...prev.mainCharacters, { name: '', description: '', role: 'supporting' }]
    }));
  };

  const removeCharacter = (index) => {
    if (formData.mainCharacters.length > 1) {
      const updatedCharacters = formData.mainCharacters.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        mainCharacters: updatedCharacters
      }));
    }
  };

  const handleImageChange = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      setImageLoading(true);
      try {
        if (type === 'cover') {
          setCoverImage(file);
          setCoverPreview(URL.createObjectURL(file));
        } else {
          setBannerImage(file);
          setBannerPreview(URL.createObjectURL(file));
        }
      } catch (error) {
        console.error('Error processing image:', error);
        alert('Error processing image. Please try again.');
      } finally {
        setImageLoading(false);
      }
    }
  };

  const removeImage = (type) => {
    if (type === 'cover') {
      setCoverImage(null);
      setCoverPreview('');
    } else {
      setBannerImage(null);
      setBannerPreview('');
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
        alert('Story title is required');
        return false;
    }
    if (!formData.description.trim()) {
        alert('Story description is required');
        return false;
    }
    const contentText = formData.content.replace(/<[^>]*>?/gm, '').trim();
    if (!contentText) {
        alert('Story content is required');
        return false;
    }
    if (formData.categories.length === 0) {
        alert('Please select at least one category');
        return false;
    }
    if (!formData.targetAudience) {
        alert('Please select a target audience');
        return false;
    }
    if (!coverImage && !coverPreview) {
        alert('Cover image is required');
        return false;
    }
    if (!bannerImage && !bannerPreview) {
        alert('Banner image is required');
        return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
        return;
    }

    const submitData = new FormData();
    
    // Append all form data fields
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('content', formData.content);
    submitData.append('categories', JSON.stringify(formData.categories));
    submitData.append('tags', JSON.stringify(formData.tags));
    submitData.append('mainCharacters', JSON.stringify(formData.mainCharacters));
    submitData.append('targetAudience', formData.targetAudience);
    submitData.append('language', formData.language);
    submitData.append('copyright', formData.copyright);
    submitData.append('status', formData.status);

    if (coverImage) {
        submitData.append('coverImage', coverImage);
    }
    if (bannerImage) {
        submitData.append('bannerImage', bannerImage);
    }

    if (id) {
        dispatch(updateStory({ id, storyData: submitData }));
    } else {
        dispatch(createStory(submitData));
    }
  };

  return (
    <div className="max-w-6xl !mx-auto !p-4 sm:!p-6 lg:!p-8">
      <div className="bg-white rounded-lg shadow-sm !p-6">
        <h1 className="text-3xl font-bold text-gray-900 !mb-6">
          {id ? 'Edit Story' : 'Create New Story'}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 !px-4 !py-3 rounded !mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="!space-y-8">
          {/* Cover & Banner Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 !mb-2">Cover Image *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg !p-4 text-center">
                {coverPreview ? (
                  <div className="!space-y-2">
                    <img src={coverPreview} alt="Cover preview" className="!mx-auto h-32 object-cover rounded"/>
                    <button type="button" onClick={() => removeImage('cover')} className="text-red-600 text-sm hover:text-red-800">Remove Image</button>
                  </div>
                ) : (
                  <div>
                    <div className="!mt-2">
                      <label htmlFor="cover-upload" className="cursor-pointer">
                        <span className="text-indigo-600 hover:text-indigo-500">Upload a file</span>
                        <input id="cover-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'cover')} disabled={imageLoading} />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 !mt-1">PNG, JPG, GIF up to 5MB</p>
                  </div>
                )}
                {imageLoading && <div className="!mt-2 text-xs text-gray-500">Uploading...</div>}
              </div>
            </div>
            {/* Banner Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 !mb-2">Banner Image *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg !p-4 text-center">
                {bannerPreview ? (
                  <div className="!space-y-2">
                    <img src={bannerPreview} alt="Banner preview" className="!mx-auto h-32 object-cover rounded"/>
                    <button type="button" onClick={() => removeImage('banner')} className="text-red-600 text-sm hover:text-red-800">Remove Image</button>
                  </div>
                ) : (
                  <div>
                    <div className="!mt-2">
                      <label htmlFor="banner-upload" className="cursor-pointer">
                        <span className="text-indigo-600 hover:text-indigo-500">Upload a file</span>
                        <input id="banner-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'banner')} disabled={imageLoading} />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 !mt-1">PNG, JPG, GIF up to 5MB</p>
                  </div>
                )}
                {imageLoading && <div className="!mt-2 text-xs text-gray-500">Uploading...</div>}
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="!space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Story Title *</label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} className="!mt-1 block w-full border border-gray-300 rounded-md shadow-sm !p-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Enter your story title" required/>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description *</label>
              <textarea id="description" name="description" rows={3} value={formData.description} onChange={handleInputChange} className="!mt-1 block w-full border border-gray-300 rounded-md shadow-sm !p-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="A brief description of your story..." required></textarea>
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 !mb-2">Categories *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {categories.map((category) => (
                <label key={category._id} className="flex items-center !space-x-2 cursor-pointer">
                  <input type="checkbox" checked={formData.categories.includes(category._id)} onChange={() => handleCategoryChange(category._id)} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"/>
                  <span className="text-sm text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 !mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 !mb-2">
              {formData.tags.map((tag, index) => (
                <span key={index} className="inline-flex items-center !px-3 !py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {tag}
                  <button type="button" onClick={() => handleTagRemove(tag)} className="!ml-1.5 text-indigo-600 hover:text-indigo-800">&times;</button>
                </span>
              ))}
            </div>
            <div className="flex !space-x-2">
              <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={handleTagKeyPress} placeholder="Add a tag and press Enter..." className="flex-1 border border-gray-300 rounded-md shadow-sm !p-2 focus:ring-indigo-500 focus:border-indigo-500"/>
              <button type="button" onClick={handleTagAdd} className="bg-gray-200 text-gray-700 !px-4 !py-2 rounded-md hover:bg-gray-300 cursor-pointer">Add</button>
            </div>
          </div>

          {/* Main Characters */}
          <div>
            <div className="flex justify-between items-center !mb-2">
              <label className="block text-sm font-medium text-gray-700">Main Characters</label>
              <button type="button" onClick={addCharacter} className="text-sm text-indigo-600 hover:text-indigo-700 cursor-pointer">+ Add Character</button>
            </div>
            <div className="!space-y-4">
              {formData.mainCharacters.map((character, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 !p-4 border rounded-lg">
                  <div className="md:col-span-4">
                    <label className="block text-xs font-medium text-gray-500">Name</label>
                    <input type="text" value={character.name} onChange={(e) => handleCharacterChange(index, 'name', e.target.value)} className="!mt-1 block w-full border border-gray-300 rounded-md shadow-sm !p-2 text-sm" placeholder="Character name"/>
                  </div>
                  <div className="md:col-span-5">
                    <label className="block text-xs font-medium text-gray-500">Description</label>
                    <input type="text" value={character.description} onChange={(e) => handleCharacterChange(index, 'description', e.target.value)} className="!mt-1 block w-full border border-gray-300 rounded-md shadow-sm !p-2 text-sm" placeholder="Character description"/>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500">Role</label>
                    <select value={character.role} onChange={(e) => handleCharacterChange(index, 'role', e.target.value)} className="!mt-1 block w-full border border-gray-300 rounded-md shadow-sm !p-2 text-sm cursor-pointer">
                      <option value="protagonist">Protagonist</option>
                      <option value="antagonist">Antagonist</option>
                      <option value="supporting">Supporting</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="md:col-span-1 flex items-end">
                    {formData.mainCharacters.length > 1 && (
                      <button type="button" onClick={() => removeCharacter(index)} className="text-red-600 hover:text-red-800 text-sm">Remove</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700">Target Audience *</label>
              <select id="targetAudience" name="targetAudience" value={formData.targetAudience} onChange={handleInputChange} className="!mt-1 block w-full border border-gray-300 rounded-md shadow-sm !p-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer" required>
                <option value="">Select target audience</option>
                {targetAudiences.map((audience) => (
                  <option key={audience._id} className='cursor-pointer' value={audience._id}>{audience.title} ({audience.minAge}+)</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language *</label>
              <select id="language" name="language" value={formData.language} onChange={handleInputChange} className="!mt-1 block w-full border border-gray-300 rounded-md shadow-sm !p-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer" required>
                <option className='cursor-pointer' value="English">English</option>
                <option className='cursor-pointer' value="Hindi">Hindi</option>
                <option className='cursor-pointer' value="Other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="copyright" className="block text-sm font-medium text-gray-700">Copyright</label>
              <select id="copyright" name="copyright" value={formData.copyright} onChange={handleInputChange} className="!mt-1 block w-full border border-gray-300 rounded-md shadow-sm !p-2 focus:ring-indigo-500 focus:border-indigo-500">
                <option className='cursor-pointer' value="all-rights-reserved">All Rights Reserved</option>
                <option className='cursor-pointer' value="creative-commons">Creative Commons</option>
                <option className='cursor-pointer' value="public-domain">Public Domain</option>
              </select>
            </div>
          </div>

          {/* Story Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 !mb-2">Story Content *</label>
            <TiptapEditor
              content={formData.content}
              onChange={handleContentChange}
              placeholder="Write your story here..."
            />
          </div>

          {/* Status and Actions */}
          <div className="flex justify-between items-center !pt-6 border-t">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <select id="status" name="status" value={formData.status} onChange={handleInputChange} className="!mt-1 border border-gray-300 rounded-md shadow-sm !p-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer">
                <option value="draft">Draft</option>
                <option value="published">Publish</option>
              </select>
            </div>
            <div className="!space-x-4">
              <button type="button" onClick={() => navigate('/writer/stories')} className="bg-gray-200 text-gray-700 !px-6 !py-2 rounded-md hover:bg-gray-300 cursor-pointer">Cancel</button>
              <button type="submit" disabled={loading || imageLoading} className="bg-indigo-600 text-white !px-6 !py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                {loading ? 'Saving...' : id ? 'Update Story' : 'Create Story'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StoryForm;