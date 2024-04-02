const formUser = document.forms['form-user'];
const btnCreate = document.querySelector('#btn-create');
const btnEdit = document.querySelector('#btn-edit');
const modal = document.querySelector('#exampleModal');
const formDelete = document.forms['form-delete'];
const btnConfirmDelete = document.querySelectorAll('#btn-confirm-delete');
const btnDelete = document.querySelector('#btn-delete');

btnCreate.onclick = function () {
    formUser.submit();
};

btnConfirmDelete.forEach(
    (item) =>
        (item.onclick = function (e) {
            const id = e.target.dataset.id;
            formDelete.action = `/user/${id}?_method=DELETE`;
        }),
);

btnDelete.onclick = () => {
    formDelete.submit();
};
