import {
  Button,
  Field,
  Fieldset,
  Input,
  Stack,
  Grid,
  GridItem,
  Image,
  Textarea,
  NumberInputRoot,
  NumberInputInput,
  NumberInputControl,
  NumberInputIncrementTrigger,
  NumberInputDecrementTrigger,
  RadioGroupRoot,
  RadioGroupItem,
  RadioGroupItemHiddenInput,
  RadioGroupItemIndicator,
  RadioGroupItemText,
  Box,
  Flex,
  useBreakpointValue,
  FieldsetErrorText,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateProductApi } from '@/services/productApi';
import { toaster } from '@/components/ui/toaster';
import { useNavigate } from 'react-router-dom';

// Define validation schema using Zod
const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  imageUrl: z.string().url('Please enter a valid image URL'),
  gender: z.enum(['Men', 'Women', 'Unisex'], {
    message: 'Please select a valid gender',
  }),
  // suitableFor: z.string().min(1, 'Please select suitable skin type'),
  price: z.number().min(0, 'Price cannot be negative'),
  volume: z.number().min(0, 'Volume cannot be negative'),
  stock: z.number().min(0, 'Stock cannot be negative'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

const ProductDetail = ({ data }) => {
  const navigate = useNavigate();

  // Responsive layout configuration
  const columns = useBreakpointValue({
    base: 'repeat(1, 1fr)',
    lg: 'repeat(2, 1fr)',
  });
  const flexDirection = useBreakpointValue({ base: 'column', lg: 'row' });
  const innerFlexWidth = useBreakpointValue({ base: '100%', lg: 'auto' });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize react-hook-form with zod resolver
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: data.name || '',
      imageUrl: data.imageUrl || '',
      gender: data.gender || 'Unisex',
      // suitableFor: data.suitableFor?.[0] || '',
      price: data.price || 0,
      volume: data.volume || 0,
      stock: data.stock || 0,
      description: data.description || '',
    },
  });

  // Update form when data changes
  useEffect(() => {
    setValue('name', data.name || '');
    setValue('imageUrl', data.imageUrl || '');
    setValue('gender', data.gender || 'Unisex');
    // setValue('suitableFor', data.suitableFor?.[0] || '');
    setValue('price', data.price || 0);
    setValue('volume', data.volume || 0);
    setValue('stock', data.stock || 0);
    setValue('description', data.description || '');
  }, [data, setValue]);

  // Form submission handler
  const onSubmit = async formData => {
    setIsSubmitting(true);

    try {
      // Ensure suitableFor is an array for API compatibility
      const productData = {
        ...formData,
        volume: formData.volume.toString() + 'ml',
        // suitableFor: [formData.suitableFor],
      };

      await updateProductApi(data._id, productData);

      toaster.create({
        title: 'Product updated successfully',
        type: 'success',
      });

      navigate('/products');
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to update product';
      toaster.create({
        title: errorMessage,
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
              Product Detail
            </Fieldset.Legend>
          </Stack>

          <Fieldset.Content>
            <Grid templateColumns={columns} gap={{ base: 4, md: 6 }}>
              {/* First row */}
              <GridItem>
                <Field.Root invalid={!!errors.name}>
                  <Field.Label fontWeight="bold" mb={1}>
                    Name
                  </Field.Label>
                  <Input
                    {...register('name')}
                    borderColor={errors.name ? 'red.300' : 'gray.300'}
                    _hover={{
                      borderColor: errors.name ? 'red.400' : 'gray.400',
                    }}
                  />
                  {errors.name && (
                    <FieldsetErrorText>{errors.name.message}</FieldsetErrorText>
                  )}
                </Field.Root>
              </GridItem>

              <GridItem>
                <Field.Root invalid={!!errors.imageUrl}>
                  <Field.Label fontWeight="bold" mb={1}>
                    Image
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
                    <Controller
                      name="imageUrl"
                      control={control}
                      render={({ field }) =>
                        field.value && (
                          <Image
                            src={field.value}
                            alt="Product"
                            boxSize="100px"
                            objectFit="cover"
                            fallbackSrc="https://via.placeholder.com/100"
                            border="1px solid"
                            borderColor="gray.200"
                          />
                        )
                      }
                    />
                  </Stack>
                </Field.Root>
              </GridItem>

              {/* Second row - Gender and Suitable For */}
              <GridItem>
                <Flex gap={4} direction={flexDirection}>
                  {/* Gender */}
                  <Field.Root
                    flex="1"
                    width={innerFlexWidth}
                    mb={{ base: 4, lg: 0 }}
                    invalid={!!errors.gender}
                  >
                    <Field.Label fontWeight="bold" mb={1}>
                      Gender
                    </Field.Label>
                    <Box
                      borderWidth="1px"
                      borderColor={errors.gender ? 'red.300' : 'gray.300'}
                      borderRadius="md"
                      p={2}
                      bg="gray.50"
                    >
                      <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                          <RadioGroupRoot
                            name={field.name}
                            value={field.value}
                            onValueChange={({ value }) => {
                              field.onChange(value);
                            }}
                          >
                            <Stack direction={{ base: 'column', sm: 'row' }}>
                              <RadioGroupItem value="Men">
                                <RadioGroupItemHiddenInput />
                                <RadioGroupItemIndicator />
                                <RadioGroupItemText>Men</RadioGroupItemText>
                              </RadioGroupItem>
                              <RadioGroupItem value="Women">
                                <RadioGroupItemHiddenInput />
                                <RadioGroupItemIndicator />
                                <RadioGroupItemText>Women</RadioGroupItemText>
                              </RadioGroupItem>
                              <RadioGroupItem value="Unisex">
                                <RadioGroupItemHiddenInput />
                                <RadioGroupItemIndicator />
                                <RadioGroupItemText>Unisex</RadioGroupItemText>
                              </RadioGroupItem>
                            </Stack>
                          </RadioGroupRoot>
                        )}
                      />
                    </Box>
                    {errors.gender && (
                      <FieldsetErrorText>
                        {errors.gender.message}
                      </FieldsetErrorText>
                    )}
                  </Field.Root>

                  {/* Suitable For */}
                  {/*   <Field.Root
                    flex="1"
                    width={innerFlexWidth}
                    invalid={!!errors.suitableFor}
                  >
                    <Field.Label fontWeight="bold" mb={1}>
                      Suitable For
                    </Field.Label>
                    <Controller
                      name="suitableFor"
                      control={control}
                      render={({ field }) => (
                        <NativeSelect.Root
                          borderColor={
                            errors.suitableFor ? 'red.300' : 'gray.300'
                          }
                        >
                          <NativeSelect.Field {...field}>
                            <For each={data.suitableFor || []}>
                              {(item, index) => (
                                <option key={index} value={item}>
                                  {item}
                                </option>
                              )}
                            </For>
                          </NativeSelect.Field>
                          <NativeSelect.Indicator />
                        </NativeSelect.Root>
                      )}
                    />
                    {errors.suitableFor && (
                      <Field.ErrorMessage>
                        {errors.suitableFor.message}
                      </Field.ErrorMessage>
                    )}
                  </Field.Root> */}
                </Flex>
              </GridItem>

              {/* Third row - Price, Volume, and Stock */}
              <GridItem>
                <Flex gap={4} direction={{ base: 'column', sm: 'row' }}>
                  <Field.Root
                    flex="1"
                    mb={{ base: 4, sm: 0 }}
                    invalid={!!errors.price}
                  >
                    <Field.Label fontWeight="bold" mb={1}>
                      Price ($)
                    </Field.Label>
                    <Controller
                      name="price"
                      control={control}
                      render={({ field: { onChange, value, ...rest } }) => (
                        <NumberInputRoot
                          min={0}
                          precision={2}
                          name={name}
                          value={value}
                          onValueChange={({ value }) => {
                            onChange(parseFloat(value));
                          }}
                          borderColor={errors.price ? 'red.300' : 'gray.300'}
                          w={'full'}
                          {...rest}
                        >
                          <NumberInputInput />
                          <NumberInputControl>
                            <NumberInputIncrementTrigger />
                            <NumberInputDecrementTrigger />
                          </NumberInputControl>
                        </NumberInputRoot>
                      )}
                    />
                    {errors.price && (
                      <FieldsetErrorText>
                        {errors.price.message}
                      </FieldsetErrorText>
                    )}
                  </Field.Root>

                  <Field.Root
                    flex="1"
                    mb={{ base: 4, sm: 0 }}
                    invalid={!!errors.volume}
                  >
                    <Field.Label fontWeight="bold" mb={1}>
                      Volume (ml)
                    </Field.Label>
                    <Controller
                      name="volume"
                      control={control}
                      render={({
                        field: { onChange, value, name, ...rest },
                      }) => (
                        <NumberInputRoot
                          min={0}
                          name={name}
                          value={value}
                          onValueChange={({ value }) => {
                            onChange(parseFloat(value));
                          }}
                          borderColor={errors.volume ? 'red.300' : 'gray.300'}
                          w={'full'}
                          {...rest}
                        >
                          <NumberInputInput />
                          <NumberInputControl>
                            <NumberInputIncrementTrigger />
                            <NumberInputDecrementTrigger />
                          </NumberInputControl>
                        </NumberInputRoot>
                      )}
                    />
                    {errors.volume && (
                      <FieldsetErrorText>
                        {errors.volume?.message}
                      </FieldsetErrorText>
                    )}
                  </Field.Root>

                  <Field.Root flex="1" invalid={!!errors.stock}>
                    <Field.Label fontWeight="bold" mb={1}>
                      Stock
                    </Field.Label>
                    <Controller
                      name="stock"
                      control={control}
                      render={({ field: { onChange, value, ...rest } }) => (
                        <NumberInputRoot
                          min={0}
                          name={name}
                          value={value}
                          onValueChange={({ value }) => {
                            onChange(parseInt(value));
                          }}
                          borderColor={errors.stock ? 'red.300' : 'gray.300'}
                          w={'full'}
                          {...rest}
                        >
                          <NumberInputInput />
                          <NumberInputControl>
                            <NumberInputIncrementTrigger />
                            <NumberInputDecrementTrigger />
                          </NumberInputControl>
                        </NumberInputRoot>
                      )}
                    />
                    {errors.stock && (
                      <FieldsetErrorText>
                        {errors.stock.message}
                      </FieldsetErrorText>
                    )}
                  </Field.Root>
                </Flex>
              </GridItem>

              {/* Last row - Description with full width */}
              <GridItem colSpan={{ base: 1, lg: 2 }}>
                <Field.Root invalid={!!errors.description}>
                  <Field.Label fontWeight="bold" mb={1}>
                    Description
                  </Field.Label>
                  <Textarea
                    {...register('description')}
                    minHeight="120px"
                    borderColor={errors.description ? 'red.300' : 'gray.300'}
                    _hover={{
                      borderColor: errors.description ? 'red.400' : 'gray.400',
                    }}
                  />
                  {errors.description && (
                    <FieldsetErrorText>
                      {errors.description.message}
                    </FieldsetErrorText>
                  )}
                </Field.Root>
              </GridItem>
            </Grid>
          </Fieldset.Content>

          <Button
            type="submit"
            colorScheme="blue"
            mt={6}
            px={6}
            size="md"
            w={{ base: 'full', md: 'auto' }}
            isLoading={isSubmitting}
            loadingText="Updating"
          >
            Update Product
          </Button>
        </Fieldset.Root>
      </form>
    </>
  );
};

export default ProductDetail;
