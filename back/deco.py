from functools import wraps

def try_decorator(func):
    @wraps(func)
    async def inner_function(*args, **kwargs):
        try:
            return await func(*args, **kwargs)

        except Exception as e:
            print(f"ERROR in function {func.__name__}: {str(e)}")
            return {
                "error": str(e),
                "success": False
            }
    return inner_function
