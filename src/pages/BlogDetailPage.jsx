import {
  Button,
  Field,
  Fieldset,
  Input,
  Stack,
  Grid,
  GridItem,
  Box,
  useBreakpointValue,
  FieldsetErrorText,
  Flex,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toaster } from '@/components/ui/toaster';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getBlogDetailApi, updateBlogApi } from '@/services/blogApi';

// Define validation schema using Zod
const blogSchema = z.object({
  title: z.string().min(1, 'Blog title is required'),
  imageUrl: z.string().url('Please enter a valid image URL'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
});

const BlogDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Responsive layout configuration
  const columns = useBreakpointValue({
    base: 'repeat(1, 1fr)',
    lg: 'repeat(2, 1fr)',
  });

  // Initialize react-hook-form with zod resolver
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      imageUrl: '',
      content: '',
    },
  });

  // Fetch blog data
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const data = await getBlogDetailApi(id);
        setBlog(data);

        // Set form values
        setValue('title', data.title || '');
        setValue('imageUrl', data.imageUrl || '');
        setValue('content', data.content || '');
      } catch (error) {
        console.log(error);

        toaster.create({
          title: 'Failed to fetch blog data',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlogData();
    }
  }, [id, setValue]);

  // Form submission handler
  const onSubmit = async formData => {
    setIsSubmitting(true);

    try {
      await updateBlogApi({ ...formData, _id: id });

      toaster.create({
        title: 'Blog updated successfully',
        type: 'success',
      });

      navigate('/blogs');
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to update blog';
      toaster.create({
        title: errorMessage,
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Custom toolbar for React-Quill
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['clean'],
    ],
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Fieldset.Root
        size="lg"
        w={'full'}
        bg="white"
        borderRadius="md"
        boxShadow="sm"
        p={{ base: 3, md: 5 }}
      >
        <Stack>
          <Fieldset.Legend fontWeight={'bold'} fontSize="xl" mb={2}>
            Blog Detail
          </Fieldset.Legend>
        </Stack>

        <Fieldset.Content>
          <Grid templateColumns={columns} gap={{ base: 4, md: 6 }}>
            {/* Title */}
            <GridItem colSpan={{ base: 1, lg: 2 }}>
              <Field.Root invalid={!!errors.title}>
                <Field.Label fontWeight="bold" mb={1}>
                  Title
                </Field.Label>
                <Input
                  {...register('title')}
                  borderColor={errors.title ? 'red.300' : 'gray.300'}
                  _hover={{
                    borderColor: errors.title ? 'red.400' : 'gray.400',
                  }}
                />
                {errors.title && (
                  <FieldsetErrorText>{errors.title.message}</FieldsetErrorText>
                )}
              </Field.Root>
            </GridItem>

            {/* Image URL */}
            <GridItem colSpan={{ base: 1, lg: 2 }}>
              <Field.Root invalid={!!errors.imageUrl}>
                <Field.Label fontWeight="bold" mb={1}>
                  Featured Image
                </Field.Label>
                <Stack spacing={3} w={'full'}>
                  <Input
                    w={'full'}
                    {...register('imageUrl')}
                    borderColor={errors.imageUrl ? 'red.300' : 'gray.300'}
                    _hover={{
                      borderColor: errors.imageUrl ? 'red.400' : 'gray.400',
                    }}
                  />
                  {errors.imageUrl && (
                    <FieldsetErrorText>
                      {errors.imageUrl.message}
                    </FieldsetErrorText>
                  )}
                  {/* <Controller
                    name="imageUrl"
                    control={control}
                    render={({ field }) =>
                      field.value && (
                        <Image
                          src={field.value}
                          alt="Blog cover"
                          maxH="200px"
                          objectFit="cover"
                          fallbackSrc="https://via.placeholder.com/400x200"
                          border="1px solid"
                          borderColor="gray.200"
                        />
                      )
                    }
                  /> */}
                </Stack>
              </Field.Root>
            </GridItem>

            {/* Content with React-Quill */}
            <GridItem w={'full'} colSpan={2}>
              <Field.Root invalid={!!errors.content} w={'full'}>
                <Field.Label fontWeight="bold" mb={1}>
                  Content
                </Field.Label>
                <Box w={'full'} borderRadius="md" overflow="hidden">
                  <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                      <ReactQuill
                        theme="snow"
                        value={field.value}
                        onChange={field.onChange}
                        modules={modules}
                        style={{
                          width: '100%',
                          height: '300px',
                          marginBottom: '50px',
                          borderColor: errors.content ? '#FC8181' : '#E2E8F0',
                        }}
                      />
                    )}
                  />
                </Box>
                {errors.content && (
                  <FieldsetErrorText>
                    {errors.content.message}
                  </FieldsetErrorText>
                )}
              </Field.Root>
            </GridItem>
          </Grid>
        </Fieldset.Content>

        <Flex justify={'center'} w="full" gap={4}>
          <Button
            colorPalette={'whiteAlpha'}
            variant={'solid'}
            flex={1}
            mt={6}
            px={6}
            size="md"
            w={{ base: 'full', md: 'auto' }}
            onClick={() => navigate('/blogs')}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            flex={1}
            colorScheme="blue"
            mt={6}
            px={6}
            size="md"
            w={{ base: 'full', md: 'auto' }}
            isLoading={isSubmitting}
            loadingText="Updating"
          >
            Update Blog
          </Button>
        </Flex>
      </Fieldset.Root>
    </form>
  );
};

export default BlogDetailPage;
