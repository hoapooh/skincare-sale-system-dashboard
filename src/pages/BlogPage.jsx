import BlogTable from '@/features/Blog/BlogTable';
import { createBlogApi, getBlogsApi } from '@/services/blogApi';
import {
  Box,
  Center,
  Heading,
  Spinner,
  Button,
  Dialog,
  Field,
  Input,
  FieldsetErrorText,
  Grid,
  GridItem,
  useBreakpointValue,
  Flex,
  CloseButton,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toaster } from '@/components/ui/toaster';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FaPlus } from 'react-icons/fa';

// Define validation schema using Zod
const blogSchema = z.object({
  title: z.string().min(1, 'Blog title is required'),
  imageUrl: z.string().url('Please enter a valid image URL'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
});

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
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
    reset,
  } = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      imageUrl: '',
      content: '',
    },
  });

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const response = await getBlogsApi();
      setBlogs(response.result);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Form submission handler
  const onSubmit = async formData => {
    setIsSubmitting(true);

    try {
      await createBlogApi(formData);

      toaster.create({
        title: 'Blog created successfully',
        type: 'success',
      });

      setIsOpen(false);
      reset();
      fetchBlogs(); // Refresh the blog list
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to create blog';
      toaster.create({
        title: errorMessage,
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="2xl">Blog Management</Heading>
        <Button colorScheme="blue" onClick={() => setIsOpen(true)}>
          <FaPlus />
          Create Post
        </Button>
      </Flex>

      {/* Create Blog Post Dialog */}
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            maxW={{ base: '95%', md: '800px' }}
            h={{ base: '90vh', md: 'auto' }}
            overflowY="auto"
          >
            <Dialog.Header>
              <Dialog.Title>Create New Blog Post</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <form id="create-blog-form" onSubmit={handleSubmit(onSubmit)}>
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
                        <FieldsetErrorText>
                          {errors.title.message}
                        </FieldsetErrorText>
                      )}
                    </Field.Root>
                  </GridItem>

                  {/* Image URL */}
                  <GridItem colSpan={{ base: 1, lg: 2 }}>
                    <Field.Root invalid={!!errors.imageUrl}>
                      <Field.Label fontWeight="bold" mb={1}>
                        Featured Image URL
                      </Field.Label>
                      <Input
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
                                borderColor: errors.content
                                  ? '#FC8181'
                                  : '#E2E8F0',
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
              </form>
            </Dialog.Body>

            <Dialog.Footer>
              <Flex justify="flex-end" gap={3}>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="create-blog-form"
                  colorScheme="blue"
                  isLoading={isSubmitting}
                  loadingText="Creating"
                >
                  Create Blog
                </Button>
              </Flex>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>

      {isLoading ? (
        <Center h="300px">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="brown"
            size="xl"
          />
        </Center>
      ) : (
        <BlogTable data={blogs} />
      )}
    </Box>
  );
};

export default BlogPage;
