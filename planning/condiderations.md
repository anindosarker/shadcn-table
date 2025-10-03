# Changes I've introduced from the original package

## Overall
- Used cva instead of api to modify the className props. Since we are not shipping with prestyled components like we used to do in MUI package, we don't need to do complicated api stuff to modify the stylings. The user can easily modify the styles by adding new variants.

### Individual components


### SRT_TableLayout
- I've omitted the ref since this code will live in user's directory, might add later

