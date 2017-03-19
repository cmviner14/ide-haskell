"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
function create(disposables) {
    return {
        set({ label, menu }) {
            const menuDisp = atom.menu.add([{
                    label: utils_1.MAIN_MENU_LABEL,
                    submenu: [{ label, submenu: menu }]
                }]);
            disposables.add(menuDisp);
            return menuDisp;
        }
    };
}
exports.create = create;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91cGktMy9pbnN0YW5jZS9tZW51LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsdUNBQTJDO0FBZ0IzQyxnQkFBd0IsV0FBZ0M7SUFDdEQsTUFBTSxDQUFDO1FBQ0wsR0FBRyxDQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBQztZQUNoQixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUM5QixLQUFLLEVBQUUsdUJBQWU7b0JBQ3RCLE9BQU8sRUFBRSxDQUFFLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUMsQ0FBRTtpQkFDcEMsQ0FBQyxDQUFDLENBQUE7WUFDSCxXQUFXLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQ3pCLE1BQU0sQ0FBQyxRQUFRLENBQUE7UUFDakIsQ0FBQztLQUNGLENBQUE7QUFDSCxDQUFDO0FBWEQsd0JBV0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5pbXBvcnQge01BSU5fTUVOVV9MQUJFTH0gZnJvbSAnLi4vLi4vdXRpbHMnXG5cbmV4cG9ydCBpbnRlcmZhY2UgSU1haW5JbnRlcmZhY2Uge1xuICAvKipcbiAgQWRkcyBuZXcgc3VtYmVudSB0byAnSGFza2VsbCBJREUnIG1lbnUgaXRlbVxuXG4gIEBwYXJhbSBuYW1lIC0tIHN1Ym1lbnUgbGFiZWwsIHNob3VsZCBiZSBkZXNjcmlwdGl2ZSBvZiBhIHBhY2thZ2VcbiAgQHBhcmFtIG1lbnUgLS0gQXRvbSBtZW51IG9iamVjdFxuXG4gIEByZXR1cm5zIERpc3Bvc2FibGUuXG4gICovXG4gIHNldCAob3B0aW9uczogSU1lbnVEZWZpbml0aW9uKTogRGlzcG9zYWJsZVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElNZW51RGVmaW5pdGlvbiB7bGFiZWw6IHN0cmluZywgbWVudTogYW55W119XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUgKGRpc3Bvc2FibGVzOiBDb21wb3NpdGVEaXNwb3NhYmxlKTogSU1haW5JbnRlcmZhY2Uge1xuICByZXR1cm4ge1xuICAgIHNldCAoe2xhYmVsLCBtZW51fSkge1xuICAgICAgY29uc3QgbWVudURpc3AgPSBhdG9tLm1lbnUuYWRkKFt7XG4gICAgICAgIGxhYmVsOiBNQUlOX01FTlVfTEFCRUwsXG4gICAgICAgIHN1Ym1lbnU6IFsge2xhYmVsLCBzdWJtZW51OiBtZW51fSBdXG4gICAgICB9XSlcbiAgICAgIGRpc3Bvc2FibGVzLmFkZChtZW51RGlzcClcbiAgICAgIHJldHVybiBtZW51RGlzcFxuICAgIH1cbiAgfVxufVxuIl19