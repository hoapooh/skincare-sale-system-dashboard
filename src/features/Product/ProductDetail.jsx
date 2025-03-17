import {
  Button,
  Field,
  Fieldset,
  For,
  Input,
  NativeSelect,
  Stack,
} from '@chakra-ui/react';
import React from 'react';

const ProductDetail = ({ data }) => {
  return (
    <>
      <Fieldset.Root size="lg" maxW="md">
        <Stack>
          <Fieldset.Legend>Product Detail</Fieldset.Legend>
        </Stack>

        <Fieldset.Content>
          <Field.Root>
            <Field.Label>Name</Field.Label>
            <Input name="name" value={data.name} />
          </Field.Root>

          <Field.Root>
            <Field.Label>Description</Field.Label>
            <Input name="description" value={data.description} />
          </Field.Root>

          <Field.Root>
            <Field.Label>Image</Field.Label>
            <Input name="imageUrl" value={data.imageUrl} />
          </Field.Root>

          <Field.Root>
            <Field.Label>Gender</Field.Label>
            <Input name="gender" value={data.gender} />
          </Field.Root>

          <Field.Root>
            <Field.Label>Price</Field.Label>
            <Input name="price" value={data.price} />
          </Field.Root>

          <Field.Root>
            <Field.Label>Stock</Field.Label>
            <Input name="stock" value={data.stock} />
          </Field.Root>

          <Field.Root>
            <Field.Label>Volume</Field.Label>
            <Input name="volume" value={data.volume} />
          </Field.Root>

          <Field.Root>
            <Field.Label>Suitable For</Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field name="suitableFor">
                <For each={data.suitableFor}>
                  {(item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  )}
                </For>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>
        </Fieldset.Content>

        <Button type="submit" alignSelf="flex-start">
          Submit
        </Button>
      </Fieldset.Root>
    </>
  );
};

export default ProductDetail;
