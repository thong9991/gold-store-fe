'use client';

import Image from 'next/image';
import { useState, useRef } from 'react';
import { FormModalProps } from './@types/FormModalProps';
import { forms } from './forms';
import { useDisclosure, Modal, ModalContent, ModalBody, Button } from '@nextui-org/react';
import { EditIcon } from '../icons/table/edit-icon';
import { DeleteIcon } from '../icons/table/delete-icon';

const FormModal = (props: FormModalProps) => {
  const size = props.type === 'create' ? 'w-8 h-8' : 'w-7 h-7';

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const targetRef = useRef(null);

  const Form = () => {
    return props.type === 'delete' && props.id
      ? forms['delete'](onOpenChange, {
          ...props,
          data: {
            id: props.id,
            table: props.table,
          },
        })
      : props.type === 'create' || props.type === 'update'
      ? forms[props.table](onOpenChange, props)
      : 'Form not found!';
  };

  return (
    <>
      <button className={`${size} flex items-center justify-center rounded-full`} onClick={onOpen}>
        {props.type === 'create' && <p className="px-4 py-2 bg-[#0072F5] rounded-xl text-white">Thêm</p>}
        {props.type === 'update' && <EditIcon size={20} fill="#979797" />}
        {props.type === 'delete' && <DeleteIcon size={20} fill="#FF0080" />}
      </button>
      <Modal ref={targetRef} isOpen={isOpen} onOpenChange={onOpenChange} className="max-w-[750px] w-full">
        <ModalContent>
          <ModalBody>
            <div className="py-2">
              <Form />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FormModal;
